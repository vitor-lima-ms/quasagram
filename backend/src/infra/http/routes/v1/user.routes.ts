import { type Request, type Response, Router } from "express";

import UserController from "../../controllers/v1/UserController.ts";

const router = Router();

router.get("/:uid", (req: Request, res: Response) =>
    new UserController().getUserByUid(req, res),
);

export default router;
