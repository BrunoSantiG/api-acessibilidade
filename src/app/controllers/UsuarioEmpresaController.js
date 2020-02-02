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
      telefone_fixo:Yup.number(),
      telefone_celular:Yup.number(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(200).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(200).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioEmpresa.isValid(req.body.usuario_empresa))) {
      return res.status(200).json({ error: "Campo usuario_empresa não esta de acordo" });
    }

    const emailExists = await Usuario.findOne({
      where: { email: req.body.usuario.email },
    });

    const usuarioExists = await Usuario.findOne({
      where: { usuario: req.body.usuario.usuario },
    });

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    } else if (emailExists) {
      return res.status(200).json({ error: "Email ja esta em uso." });
    }

    await Usuario_Empresa.create({
      cnpj: req.body.usuario_empresa.cnpj,
      razao_social: req.body.usuario_empresa.razao_social,
      telefone_fixo: req.body.usuario_empresa.telefone_fixo,
      telefone_celular: req.body.usuario_empresa.telefone_celular,
      Usuario:req.body.usuario,
      Endereco:req.body.endereco,
    }, {
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Endereco, as: "Endereco"}],
    }).then((usuario_empresa) => {
      usuario_empresa.Usuario.senha=undefined;
      let { id } = Usuario;
      return res.status(201).json({
        usuario:usuario_empresa.Usuario,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });

  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const empresas = await Usuario_Empresa.findAll({
      attributes: ["cnpj", "razao_social", "telefone_fixo", "telefone_celular"],
      include: [
        {
          model: Endereco,
          as: "Endereco"
        },
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["nome", "email"]
        }
      ],
      limit: 20,
      offset: (page - 1) * 20
    });

    return res.status(201).json({ empresas });
  }

  async update(req, res) {
    const schemaUsuario = Yup.object().shape({
      nome: Yup.string(),
      usuario: Yup.string(),
      email: Yup.string().email()
    });

    const schemaEndereco = Yup.object().shape({
      pais: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      bairro: Yup.string(),
      cep: Yup.number(),
      logradouro: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string()
    });

    const schemaUsuarioEmpresa = Yup.object().shape({
      cnpj: Yup.string(),
      razao_social: Yup.string(),
      telefone_fixo: Yup.number(),
      telefone_celular: Yup.number()
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res
        .status(400)
        .json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res
        .status(400)
        .json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioEmpresa.isValid(req.body.usuario_empresa))) {
      return res
        .status(400)
        .json({ error: "Campo usuario_empresa não esta de acordo" });
    }

    const { id_usuario, id_endereco } = await Usuario_Empresa.findByPk(req.id_usuario);
    const empresa = await Usuario_Empresa.findByPk(req.id_usuario);

    const usuarioPk = await Usuario.findOne({
      where: { id: id_usuario }
    });
    const enderecoPk = await Endereco.findOne({
      where: { id: id_endereco }
    });

    const { usuario, usuario_empresa, endereco } = req.body;
    const empresas = await empresa.update(
      usuario_empresa,
      usuarioPk.update(usuario),
      enderecoPk.update(endereco)
    );

    return res.status(201).json({ empresas });
  }
}

export default new UsuarioEmpresaController();
