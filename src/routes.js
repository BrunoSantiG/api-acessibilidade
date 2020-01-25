import { Router } from 'express';

import UsuarioPcdController from './app/controllers/UsuarioPcdController';
import SessionController from './app/controllers/SessionController';
import UsuarioFreelancerController from './app/controllers/UsuarioFreelancerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
routes.post('/pcd', UsuarioPcdController.store);
routes.post('/sessions', SessionController.store);
routes.post('/freelancer', UsuarioFreelancerController.store);

//routes.use(authMiddleware);

//routes.put('/users', UsuarioController.update);

export default routes;
