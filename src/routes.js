import { Router } from 'express';

import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UsuarioController.store);
routes.post('/sessions', SessionController.store);

//routes.use(authMiddleware);

//routes.put('/users', UsuarioController.update);


export default routes;