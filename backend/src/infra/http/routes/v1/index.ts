import { Router } from 'express';

import userRouter from './user.routes.ts';

const routers = Router();

routers.use('/user', userRouter);

export default routers;
