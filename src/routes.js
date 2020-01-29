import { Router } from 'express';

import UsuarioPcdController from './app/controllers/UsuarioPcdController';
import UsuarioController from './app/controllers/UsuarioController';
import SessionController from './app/controllers/SessionController';
import UsuarioFreelancerController from './app/controllers/UsuarioFreelancerController';
import UsuarioEmpresaController from './app/controllers/UsuarioEmpresaController';
import TipoDeficienciaController from './app/controllers/TipoDeficienciaController';
import VagasController from './app/controllers/VagasController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/pcd', UsuarioPcdController.store);
routes.post('/sessions', SessionController.store);
routes.post('/freelancer', UsuarioFreelancerController.store);
routes.post('/empresas', UsuarioEmpresaController.store);
routes.post('/vagas', VagasController.store);


routes.get('/usuario/usuarioExiste/:usuario', UsuarioController.UsuarioExists);
routes.get('/usuario/emailExiste/:email', UsuarioController.EmailExists);
routes.get('/tipoDeficiencia', TipoDeficienciaController.listAll);


routes.use(authMiddleware);
routes.put("/empresas", UsuarioEmpresaController.update);
routes.get('/empresas', UsuarioEmpresaController.index);
routes.get('/pcd/usuario/:usuario', UsuarioPcdController.showByUsuario);
routes.get('/pcd/id/:id', UsuarioPcdController.showById);
routes.get('/pcd', UsuarioPcdController.index);
routes.put('/pcd', UsuarioPcdController.update);

export default routes;
