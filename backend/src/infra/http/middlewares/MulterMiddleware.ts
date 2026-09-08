import type { Request } from 'express';
import multer from 'multer';

import AppError from '../../../app/errors/AppError.ts';

const DEFAULT_FILE_SIZE = 10_000_000; // 10 MB in bytes

export default (input: {
  req: Request;
  formFileFields: {
    acceptedMimetypes: string[];
    fieldName: string;
    maxNumberOfFiles: number;
  }[];
  maxFileSize?: number;
}) => {
  if (!input.req.file || !input.req.files) {
    throw new AppError({
      message: 'req.file or req.files is undefined',
      errorCode: 'req.file"s"_IS_UNDEFINED',
    });
  }

  if (!input.formFileFields.length) {
    throw new AppError({
      message: 'formFileFields lenght must be gt 0',
      errorCode: 'INVALID_ARRAY_LENGTH',
    });
  }

  const commonConfigForMiddleware: multer.Options = {
    limits: {
      files: input.formFileFields.length,
      fileSize: input.maxFileSize ? input.maxFileSize : DEFAULT_FILE_SIZE,
    },
  };

  if (input.formFileFields.length === 1) {
    const fieldWithFileOrFilesToUpload = input.formFileFields[0]!; // I already verify that input.formFileFields[0] is truthy on if (!input.formFileFields.length)

    if (!fieldWithFileOrFilesToUpload.acceptedMimetypes.length) {
      throw new AppError({
        message: 'acceptedMimetypes lenght must be gt 0',
        errorCode: 'INVALID_ARRAY_LENGTH',
      });
    }
    if (!fieldWithFileOrFilesToUpload.maxNumberOfFiles) {
      throw new AppError({
        message: 'maxNumberOfFiles must be gt 0',
        errorCode: 'INVALID_NUMBER',
      });
    }

    const commonFileFilter: multer.Options['fileFilter'] = (_, file, cb) => {
      if (
        !fieldWithFileOrFilesToUpload.acceptedMimetypes.includes(file.mimetype)
      ) {
        cb(null, false);

        throw new AppError({
          message: 'req.file.mimetype is not accepted',
          errorCode: 'INVALID_FILE_MIMETYPE',
        });
      }

      cb(null, true);
    };

    if (fieldWithFileOrFilesToUpload.maxNumberOfFiles === 1) {
      return multer({
        ...commonConfigForMiddleware,
        fileFilter: commonFileFilter,
      }).single(fieldWithFileOrFilesToUpload.fieldName);
    }

    return multer({
      ...commonConfigForMiddleware,
      fileFilter: commonFileFilter,
    }).array(
      fieldWithFileOrFilesToUpload.fieldName,
      fieldWithFileOrFilesToUpload.maxNumberOfFiles,
    );
  }

  return multer({
    ...commonConfigForMiddleware,
    fileFilter: (req, _, cb) => {
      const filesFromReqFiles = req.files!; // I already verify that req.files is truthy on if (!req.file || !req.files)

      if (Array.isArray(filesFromReqFiles)) {
        cb(null, false);

        throw new AppError({
          message: 'req.files is an array instead of a object',
          errorCode: 'req.files_IS_AN_ARRAY',
        });
      }

      for (const formFileField of input.formFileFields) {
        const filesFromFormFileField =
          filesFromReqFiles[formFileField.fieldName];

        if (!filesFromFormFileField) {
          cb(null, false);

          throw new AppError({
            message: 'filesFromFormFileField is undefined',
            errorCode: 'filesFromFormFileField_IS_UNDEFINED',
          });
        }

        for (const fileFromFormFileField of filesFromFormFileField) {
          if (
            !formFileField.acceptedMimetypes.includes(
              fileFromFormFileField.mimetype,
            )
          ) {
            cb(null, false);

            throw new AppError({
              message: 'req.file.mimetype is not accepted',
              errorCode: 'INVALID_FILE_MIMETYPE',
            });
          }

          cb(null, true);
        }
      }
    },
  }).fields(
    input.formFileFields.map((formFileField) => ({
      name: formFileField.fieldName,
      maxCount: formFileField.maxNumberOfFiles,
    })),
  );
};
