import multer from 'multer';

import AppError from '../../../app/errors/AppError.ts';
import verifyIfArrayLengthGtZero from '../../../app/utils/verifyIfArrayLengthGtZero.ts';

/**
 * @refactor
 * 
 * input: {
 *  formFileFields: {
 *    acceptedMimetypes: string[];
 *    fieldName: string;
 *    maxNumberOfFiles: number;
 *   }[],
 *   maximumFileSize?: number
 * }
 */
export default (input: {
  acceptedMimetypes: string[];
  formFieldNames: string[];
  maxNumberOfFiles: number;
  fileSize?: number;
}) => {
  if (
    !verifyIfArrayLengthGtZero(input.acceptedMimetypes)
    || !verifyIfArrayLengthGtZero(input.formFieldNames)
  ) {
    throw new AppError({
      message: 'acceptedMimetypes or formFieldNames must be gt than 0',
      errorCode: 'ERROR_ON_MulterMiddleware',
    });
  }

  if (!input.maxNumberOfFiles) {
    throw new AppError({
      message: 'maxNumberOfFiles must be gt than 0',
      errorCode: 'ERROR_ON_MulterMiddleware',
    });
  }

  const defaultFileSize = 10_000_000 // 10 MB
  const storage = multer.memoryStorage();

  if (input.maxNumberOfFiles === 1) {
    return multer({
      limits: { fileSize: input.fileSize },
      fileFilter: (req, _, cb) => {
        if (req.file && !input.acceptedMimetypes.includes(req.file.mimetype)) {
          throw new AppError({
            message:
              'input.acceptedMimetypes does not includes req.file.mimetype',
            errorCode: 'ERROR_ON_MulterMiddleware',
          });
        }

        cb(null, true);
      },
      storage,
    }).single(input.formFieldNames[0]!); // Already verified that typeof input.formFieldNames[0] === 'string' on !verifyIfArrayLengthGtZero(input.formFieldNames)
  } else {
    return multer({
      limits: { fileSize: input.fileSize, files: input.maxNumberOfFiles },
      fileFilter: (req, _, cb) => {
        if (req.file && !input.acceptedMimetypes.includes(req.file.mimetype)) {
          throw new AppError({
            message:
              'input.acceptedMimetypes does not includes req.file.mimetype',
            errorCode: 'ERROR_ON_MulterMiddleware',
          });
        }

        cb(null, true);
      },
      storage,
    }).fields(input.formFieldNames[0]!);
  }
};
