import busboy from 'busboy';
import type { NextFunction, Request, Response } from 'express';

import AppError from '../../../app/errors/AppError.ts';

const DEFAULT_FILE_SIZE = 10_000_000; // 10 MB in bytes

export default (input: {
  formFileFields: {
    fileMimetypeValidators: Array<(buffer: Buffer) => boolean>;
    fieldName: string;
    maxNumberOfFiles: number;
  }[];
  maxFileSize?: number;
}) => {
  if (!input.formFileFields.length) {
    throw new AppError({
      message: 'formFileFields lenght must be gt 0',
      errorCode: 'INVALID_ARRAY_LENGTH',
    });
  }

  for (const formFileField of input.formFileFields) {
    if (!formFileField.fileMimetypeValidators.length) {
      throw new AppError({
        message: 'fileMimetypeValidators lenght must be gt 0',
        errorCode: 'INVALID_ARRAY_LENGTH',
      });
    }
    if (!formFileField.maxNumberOfFiles) {
      throw new AppError({
        message: 'maxNumberOfFiles must be gt 0',
        errorCode: 'INVALID_NUMBER',
      });
    }
  }

  const formFileFieldsByName = new Map(
    input.formFileFields.map((formFileField) => [
      formFileField.fieldName,
      formFileField,
    ]),
  );

  const maxNumberOfFiles = input.formFileFields.reduce(
    (total, formFileField) => total + formFileField.maxNumberOfFiles,
    0,
  );

  return (req: Request, _: Response, next: NextFunction) => {
    const contentTypeHeader = req.headers['content-type'];

    if (
      !contentTypeHeader
      || !contentTypeHeader.includes('multipart/form-data')
    ) {
      return next(
        new AppError({
          message: 'Content-Type must be multipart/form-data',
          errorCode: 'INVALID_CONTENT_TYPE',
        }),
      );
    }

    const fields: Record<string, string> = {};
    const filesByField: Record<
      string,
      {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
      }[]
    > = {};
    let parseError: Error | undefined;

    const bb = busboy({
      headers: req.headers,
      limits: {
        files: maxNumberOfFiles,
        fileSize: input.maxFileSize ? input.maxFileSize : DEFAULT_FILE_SIZE,
      },
    });

    bb.on('field', (name, value) => {
      fields[name] = value;
    });

    bb.on('file', (name, fileStream, info) => {
      const formFileField = formFileFieldsByName.get(name);

      if (!formFileField) {
        fileStream.resume();

        parseError = new AppError({
          message: 'Unexpected file field',
          errorCode: 'UNEXPECTED_FILE_FIELD',
        });

        return;
      }

      const currentFilesForField = filesByField[name] ?? [];

      if (currentFilesForField.length >= formFileField.maxNumberOfFiles) {
        fileStream.resume();

        parseError = new AppError({
          message: 'maxNumberOfFiles exceeded for field',
          errorCode: 'maxNumberOfFiles_EXCEEDED',
        });

        return;
      }

      const chunks: Buffer[] = [];
      let truncated = false;

      fileStream.on('data', (chunk: Buffer) => chunks.push(chunk));

      fileStream.on('limit', () => (truncated = true));

      fileStream.on('close', () => {
        if (truncated) {
          parseError = new AppError({
            message: 'File size limit exceeded',
            errorCode: 'FILE_SIZE_LIMIT_EXCEEDED',
          });

          return;
        }

        if (parseError) return;

        const buffer = Buffer.concat(chunks);

        const isFileMimetypeAccepted =
          formFileField.fileMimetypeValidators.some((fileMimetypeValidator) =>
            fileMimetypeValidator(buffer),
          );

        if (!isFileMimetypeAccepted) {
          parseError = new AppError({
            message: 'req.file.mimetype is not accepted',
            errorCode: 'INVALID_FILE_MIMETYPE',
          });

          return;
        }

        if (!filesByField[name]) {
          filesByField[name] = [];
        }

        filesByField[name].push({
          buffer,
          encoding: info.encoding,
          fieldname: name,
          mimetype: info.mimeType,
          originalname: info.filename,
          size: buffer.length,
        });
      });
    });

    bb.on('error', (error: Error) => (parseError = error));

    bb.on('close', () => {
      if (parseError) return next(parseError);

      req.body = { ...fields };

      if (input.formFileFields.length === 1) {
        const uniqueFileField = input.formFileFields[0]!; // I already verify that input.formFileFields[0] !== undefined on if (!input.formFileFields.length)
        const filesForUniqueFileField =
          filesByField[uniqueFileField.fieldName] ?? [];

        if (uniqueFileField.maxNumberOfFiles === 1) {
          req.file = filesForUniqueFileField[0];
          req.files = undefined;
        } else {
          req.file = undefined;
          req.files = filesForUniqueFileField;
        }
      } else {
        req.file = undefined;
        req.files = filesByField;
      }

      return next();
    });

    if (req.rawBody) {
      bb.end(req.rawBody);
    } else {
      req.pipe(bb);
    }
  };
};
