import { Router } from 'express';

import UsuarioPcdController from './app/controllers/UsuarioPcdController';
import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';
import UsuarioFreelancerController from './app/controllers/UsuarioFreelancerController';
import TipoDeficienciaController from './app/controllers/TipoDeficienciaController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
routes.post('/pcd', UsuarioPcdController.store);
routes.post('/sessions', SessionController.store);
routes.post('/freelancer', UsuarioFreelancerController.store);
routes.get('/usuario/usuarioExiste/:usuario', UsuarioController.UsuarioExists);
routes.get('/usuario/emailExiste/:email', UsuarioController.EmailExists);
routes.get('/tipoDeficiencia', TipoDeficienciaController.listAll);

//routes.use(authMiddleware);

//routes.put('/users', UsuarioController.update);

export default routes;
