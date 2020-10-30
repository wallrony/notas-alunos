import express from 'express';
import UserController from './../data/controllers/UserController';
import MatterController from '../data/controllers/MatterController';
import GradesController from '../data/controllers/GradesController';

const coreRouter = express.Router();

coreRouter.route('/users/:user_id')
  .get(UserController.show)
  .put(UserController.edit);

coreRouter.get('/users', UserController.index);

coreRouter.get('/matters', MatterController.index);

coreRouter.get('/users/:user_id/matters/:matter_id/grades', GradesController.index);

export default coreRouter;