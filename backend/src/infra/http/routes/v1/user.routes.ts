import { type Request, type Response, Router } from 'express';

import middlewares from '../../middlewares/index.ts';
import UserController from '../../controllers/v1/UserController.ts';

const router = Router();

router.post(
  '/create',
  middlewares.userCreateUserRequest,
  (req) => middlewares.multerMiddlewareFactory({
    req,
    formFileFields: [
      {
        acceptedMimetypes: [''],
        fieldName: 'profilePhoto',
        maxNumberOfFiles: 1,
      }
    ]
  })
)

router.get(
  '/:uid',
  middlewares.userGetUserByUidRequest,
  (req: Request, res: Response) => new UserController().getUserByUid(req, res),
);

export default router;
