import * as Yup from "yup";
import Usuario from "../models/Usuario";
import Usuario_Pcd from "../models/Usuario_Pcd";
import Endereco from "../models/Endereco";
import Curriculo from "../models/Curriculo";
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
const routes = new Router();


function generateToken(params = {}){
  const token = jwt.sign(params,authConfig.secret,{
      expiresIn: 86400,
  });
  return token;
}

class UsuarioPcdController {
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
      telefone_fixo:Yup.number(),
      telefone_celular:Yup.number(),
      dt_nascimento: Yup.date()().required(),
      laudo_url: Yup.string(),
      id_tipo_deficiencia: Yup.string().required(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(200).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(200).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioPcd.isValid(req.body.usuario_pcd))) {
      return res.status(200).json({ error: "Campo usuario_pcd não esta de acordo" });
    }

    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });
    

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    }else if(emailExists){
      return res.status(200).json({ error: "Email ja esta em uso." });
    }


    await Usuario_Pcd.create({
      rg: req.body.usuario_pcd.rg,
      telefone_fixo: req.body.usuario_pcd.telefone_fixo,
      telefone_celular: req.body.usuario_pcd.telefone_celular,
      dt_nascimento: req.body.usuario_pcd.dt_nascimento,
      laudo_url: req.body.usuario_pcd.laudo_url,
      id_tipo_deficiencia: req.body.usuario_pcd.id_tipo_deficiencia,
      Usuario:req.body.usuario,
      Curriculo:{
        "objetivo": "",
      },
      Endereco:req.body.endereco,
    }, {
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Curriculo, as: "Curriculo"},
        {model: Endereco, as: "Endereco"}],
    }).then((usuario_pcd) => {
      usuario_pcd.Usuario.senha=undefined;
      return res.status(201).json({
        usuario:usuario_pcd.Usuario,
        token: generateToken({
          id_usuario: usuario_pcd.Usuario.id,
          tipo_usuario: usuario_pcd.Usuario.id_tipo_usuario
        })
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });
  }
  

  async showByUsuario(req, res){
    const usuario = await Usuario.findOne({where :{usuario : req.params.usuario}})
    await Usuario_Pcd.findOne({ where: {id_usuario: usuario.id},
      include:[{model:Endereco, as: "Endereco"}]}).then((usuario_pcd) =>{
      return res.status(201).json({
        usuario_pcd,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async showById(req, res){
    await Usuario_Pcd.findOne({ where: {id_usuario: req.params.id},
      include:[{model:Endereco, as: "Endereco"}]}).then((usuario_pcd) =>{
      return res.status(201).json({
        usuario_pcd,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async index(req, res){
    await Usuario_Pcd.findAll({include:[{model:Endereco, as: "Endereco"}]}).then((usuario) =>{
      return res.status(201).json({
        usuario,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async update(req, res){
    routes.use(authMiddleware);
    const schemaUsuario = Yup.object().shape({
      nome: Yup.string().required(),
      usuario: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
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
      telefone_fixo:Yup.number(),
      telefone_celular:Yup.number(),
      dt_nascimento: Yup.string().required(),
      laudo_url: Yup.string(),
      id_tipo_deficiencia: Yup.string().required(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(200).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(200).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioPcd.isValid(req.body.usuario_pcd))) {
      return res.status(200).json({ error: "Campo usuario_pcd não esta de acordo" });
    }

    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });

    if (usuarioExists) {
      return res.status(200).json({ error: "Usuario ja existe." });
    }else if(emailExists){
      return res.status(200).json({ error: "Email ja esta em uso." });
    }

    const filtro = {
      where: {id_usuario : req.id_usuario},
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Endereco, as: "Endereco"}
      ]
    }

    Usuario_Pcd.findOne(filtro).then(async (usuario_pcd) =>  {
      if(usuario_pcd){
        const update_usuario = await usuario_pcd.Usuario.update(req.body.usuario);
        const update_endereco = await usuario_pcd.Endereco.update(req.body.endereco);
        const update_usuario_pcd = await usuario_pcd.update({
          rg: req.body.usuario_pcd.rg,
          telefone_fixo: req.body.usuario_pcd.telefone_fixo,
          telefone_celular: req.body.usuario_pcd.telefone_celular,
          dt_nascimento: req.body.usuario_pcd.dt_nascimento,
          laudo_url: req.body.usuario_pcd.laudo_url,
          id_tipo_deficiencia: req.body.usuario_pcd.id_tipo_deficiencia
        })
        update_usuario.senha = undefined;
        return res.status(201).json({
          usuario:update_usuario
        })
      }
      else{
        return res.status(200).json({
           error: "Usuario não encontrado." 
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

}

export default new UsuarioPcdController();
