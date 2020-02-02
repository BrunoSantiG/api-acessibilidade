import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Usuario from "../models/Usuario";
import authConfig from '../../config/auth';

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
  return token;
}


class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      usuario: Yup.string().required(),
      senha: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(200).json({ error: 'Campos não preenchidos corretamente' });
    }

    const { usuario, senha } = req.body;

    const usuarioEmail = await Usuario.findOne({ where: { email: usuario } });
    const usuarioLogin = await Usuario.findOne({ where: { usuario: usuario}})

    let user = '';

    usuarioEmail ? (user = usuarioEmail) : (user=usuarioLogin);
    
    if (!user) {
      return res.status(200).json({ error: 'Usuario Não existe' });
    }

    if (!(await user.checkPassword(senha))) {
      return res.status(200).json({ error: 'Senha Invalida' });
    }

    user.senha=undefined;


    return res.status(200).json({
      user,
      token: generateToken({
        id_usuario: user.id,
        tipo_usuario: user.id_tipo_usuario
      })
    });
  }
}

export default new SessionController();
