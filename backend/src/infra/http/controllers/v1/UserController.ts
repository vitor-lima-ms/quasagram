import { container } from "tsyringe";
import type { Request, Response } from "express";

import GetUserById from "../../../../app/useCases/v1/user/User_GetUserByUidUC.ts";

class UserController {
    async getUserByUid(req: Request, res: Response): Promise<Response> {
        const getUserByUidUC = container.resolve(GetUserById);

        return res
            .status(200)
            .json(
                await getUserByUidUC.execute({
                    uid: req.params["uid"] as string,
                }),
            );
    }
}

export default UserController;
