import { container } from 'tsyringe';
import type { Request, Response } from 'express';

import CreateUser from '../../../../app/useCases/v1/user/User_CreateUserUC.ts';
import GetUserById from '../../../../app/useCases/v1/user/User_GetUserByUidUC.ts';

class UserController {
  async createUser(req: Request, res: Response): Promise<Response> {
    const createUserUC = container.resolve(CreateUser);

    return res.status(201).json(await createUserUC.execute(req.body));
  }

  async getUserByUid(req: Request, res: Response): Promise<Response> {
    const getUserByUidUC = container.resolve(GetUserById);

    return res
      .status(200)
      .json(await getUserByUidUC.execute({ uid: req.params[0]! }));
  }
}

export default UserController;
