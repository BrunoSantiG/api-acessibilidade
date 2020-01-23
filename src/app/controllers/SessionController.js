import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Usuario from '../models/Usuario';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { usuario, password } = req.body;

    const usuarioEmail = await Usuario.findOne({ where: { email: usuario } });
    const usuarioLogin = await usuario.findOne({ where: { usuario: usuario}})

    let user = '';

    usuarioEmail ? (user = usuarioEmail) : (user=usuarioLogin);

    if (!user) {
      return res.status(404).json({ error: 'Usuario Não existe' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(404).json({ error: 'Senha Invalida' });
    }

    const { id, name } = user;

    return res.json({
      usuario: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
