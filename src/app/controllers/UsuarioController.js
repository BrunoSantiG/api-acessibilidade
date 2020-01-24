import * as Yup from "yup";
import Usuario from "../models/Usuario";
import Usuario_Pcd from "../models/Usuario_Pcd";
import Endereco from "../models/Endereco";
import Curriculo from "../models/Curriculo";
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';


function generateToken(params = {}){
  const token = jwt.sign(params,authConfig.secret,{
      expiresIn: 86400,
  });
  return token;
}

class UsuarioController {
  async store(req, res) {
    const schemaUsuario = Yup.object().shape({
      nome: Yup.string().required(),
      usuario: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required(),
      id_tipo_usuario: Yup.number().required(),
    });

    const schemaEndereco = Yup.object().shape({
      pais: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      bairro: Yup.string(),
      cep: Yup.number(),
      logradouro: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
    });

    const schemaUsuarioPcd = Yup.object().shape({
      rg: Yup.string().required(),
      dt_nascimento: Yup.string().required(),
      laudo_url: Yup.string(),
      id_tipo_deficiencia: Yup.string().required(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(400).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(400).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioPcd.isValid(req.body.usuario_pcd))) {
      return res.status(400).json({ error: "Campo usuario_pcd não esta de acordo" });
    }

    console.log("1");

    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    console.log("2");

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });

    console.log("3");
    

    if (usuarioExists) {
      return res.status(400).json({ error: "Usuario ja existe." });
    }else if(emailExists){
      return res.status(400).json({ error: "Email ja esta em uso." });
    }



    const user = await Usuario.create(req.body.usuario);
    user.senha=undefined;
    const curriculo = await Curriculo.create();
    const endereco = await Endereco.create(req.body.endereco);
    const usuario_pcd = await Usuario_Pcd.create({
      rg: req.body.usuario_pcd.rg,
      dt_nascimento: req.body.usuario_pcd.dt_nascimento,
      laudo_url: req.body.usuario_pcd.laudo_url,
      id_tipo_deficiencia: req.body.usuario_pcd.id_tipo_deficiencia,
      id_usuario: user.id,
      id_curriculo: curriculo.id,
      id_endereco: endereco.id,
    });

    return res.status(201).json({
        user,
        token:generateToken({id_usuario:user.id,usuario_pcd_id:usuario_pcd.id,tipo_usuario:user.id_tipo_usuario})
    });
  }

  /*async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    const usuario = await Usuario.findByPk(req.usuarioId);

    if (email !== usuario.email) {
      const usuarioExists = await Usuario.findOne({ where: { email } });

      if (usuarioExists) {
        return res.status(400).json({ error: 'Usuario already exists.' });
      }
    }

    if (oldPassword && !(await usuario.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await usuario.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }*/
}

export default new UsuarioController();
