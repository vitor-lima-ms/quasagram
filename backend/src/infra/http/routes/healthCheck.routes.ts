import { type Request, type Response, Router } from "express";

import HealthCheckController from "../controllers/HealthCheckController.ts";

const routers = Router();

routers.get("/health", (req: Request, res: Response) =>
  new HealthCheckController().healthCheck(req, res),
);

export default routers;
