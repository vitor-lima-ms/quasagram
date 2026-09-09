import { type Request, type Response, Router } from 'express';

import isJpeg from '../../../../app/utils/isJpeg.ts';
import isPng from '../../../../app/utils/isPng.ts';
import middlewares from '../../middlewares/index.ts';
import UserController from '../../controllers/v1/UserController.ts';

const router = Router();

router.post(
  '/create',
  middlewares.busboyMiddlewareFactory({
    formFileFields: [
      {
        fileMimetypeValidators: [isJpeg, isPng],
        fieldName: 'profilePhoto',
        maxNumberOfFiles: 1,
      },
    ],
  }),
  middlewares.userCreateUserRequest,
  (req: Request, res: Response) => new UserController().createUser(req, res),
);

router.get(
  '/:uid',
  middlewares.userGetUserByUidRequest,
  (req: Request, res: Response) => new UserController().getUserByUid(req, res),
);

export default router;
