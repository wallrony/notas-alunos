import express from 'express';
import AuthController from '../data/controllers/AuthController';
import accountsRouter from './AccountsRouter';
import coreRouter from './CoreRouter';

const apiRouter = express.Router();

apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/core', coreRouter);
apiRouter.all('*', AuthController.authenticate);

export default apiRouter;