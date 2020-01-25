import * as Yup from "yup";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario";
import Usuario_Empresa from "../models/Usuario_Empresa";
import Endereco from "../models/Endereco";
import authConfig from '../../config/auth';

function generateToken(params = {}) {
  const token = jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
  return token;
}

class UsuarioEmpresaController {
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

    const schemaUsuarioEmpresa = Yup.object().shape({
      cnpj: Yup.string().required(),
      razao_social: Yup.string().required(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(400).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(400).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioEmpresa.isValid(req.body.usuario_empresa))) {
      return res.status(400).json({ error: "Campo usuario_empresa não esta de acordo" });
    }

    console.log("1");

    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email },
    });

    console.log("2");

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario },
    });

    console.log("3");

    if (usuarioExists) {
      return res.status(400).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(400).json({ error: "Email ja esta em uso." });
    }

    const user = await Usuario.create(req.body.usuario);

    user.senha = undefined;

    const endereco = await Endereco.create(req.body.endereco);

    const usuario_empresa = await Usuario_Empresa.create({
      cnpj: req.body.usuario_empresa.cnpj,
      razao_social: req.body.usuario_empresa.razao_social,
      id_usuario: user.id,
      id_endereco: endereco.id,
    });

    return res.status(201).json({
      user,
      token: generateToken({
        id_usuario: user.id,
        usuario_empresa_id: usuario_empresa.id,
        tipo_usuario: user.id_tipo_usuario
      })
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const empresas = await Usuario_Empresa.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(empresas);
  }
}

export default new UsuarioEmpresaController();
