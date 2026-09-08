// Ref: https://dev.to/gabrielanhaia/module-augmentation-in-typescript-three-patterns-and-one-foot-gun-474h

import 'express';

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    uid: string;
  }

  interface Request {
    user: { name: string };
  }
}