import express from 'express';
import AuthController from './../data/controllers/AuthController'

const accountsRouter = express.Router();

accountsRouter.post('/login', AuthController.login);

export default accountsRouter;