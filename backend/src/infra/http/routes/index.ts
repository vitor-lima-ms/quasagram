import { Router } from 'express';

import healthCheckRouter from './healthCheck.routes.ts';
import v1Router from './v1/index.ts';

const routers = Router();

routers.use('/', healthCheckRouter);
routers.use('/v1', v1Router);

export default routers;
