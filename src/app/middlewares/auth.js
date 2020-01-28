import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.id_usuario = decoded.id_usuario;
    req.usuario_pcd_id = decoded.usuario_pcd_id;
    req.tipo_usuario = decoded.tipo_usuario;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
