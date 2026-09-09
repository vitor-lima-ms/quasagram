// Ref: https://dev.to/gabrielanhaia/module-augmentation-in-typescript-three-patterns-and-one-foot-gun-474h

import 'express';
// We need this to add file and files property to req.file; This is done by Multer (plain Express does not have them)
/* eslint-disable @typescript-eslint/no-unused-vars  */
import type { Multer } from '@types/multer';

/* eslint-disable @typescript-eslint/no-empty-object-type */
interface CustomExpressMulterFile extends Pick<
  Express.Multer.File,
  'buffer' | 'encoding' | 'fieldname' | 'mimetype' | 'originalname' | 'size'
> {}

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    uid: string;
  }

  interface Request {
    // To use with Busboy (Multer does not work properly with Firebase Functions)
    rawBody?: Buffer;
    file?: Express.Multer.File | CustomExpressMulterFile;
    files?:
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[]
      | CustomExpressMulterFile[]
      | { [fieldname: string]: CustomExpressMulterFile[] };
  }
}
