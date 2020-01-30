import * as Yup from "yup";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario";
import Curriculo from "../models/Curriculo";
import Usuario_Freelancer from "../models/Usuario_Freelancer";
import Endereco from "../models/Endereco";
import authConfig from '../../config/auth';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
const routes = new Router();

function generateToken(params = {}){
    const token = jwt.sign(params,authConfig.secret,{
        expiresIn: 86400,
    });
    return token;
  }

  function cryptPass(senha){
    if (senha) {
      return bcrypt.hash(senha, 10);
    }
  };

  class UsuarioFreelancerController {
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

      const schemaUsuarioFreelancer = Yup.object().shape({
        cpf: Yup.string().required(),
        telefone_fixo:Yup.number(),
        telefone_celular:Yup.number(),
        dt_nascimento: Yup.date().required(),
      });

      if (!(await schemaUsuario.isValid(req.body.usuario))) {
        return res.status(400).json({ error: "Campo usuario não esta de acordo" });
      }
  
      if (!(await schemaEndereco.isValid(req.body.endereco))) {
        return res.status(400).json({ error: "Campo endereco não esta de acordo" });
      }
  
      if (!(await schemaUsuarioFreelancer.isValid(req.body.usuario_freelancer))) {
        return res.status(400).json({ error: "Campo usuario_freelancer não esta de acordo" });
      }
  
      const emailExists = await Usuario.findOne({
        where: {email: req.body.usuario.email},
      });
  
      const usuarioExists = await Usuario.findOne({
        where: {usuario: req.body.usuario.usuario},
      });
      
      req.body.usuario.senha = await cryptPass(req.body.usuario.senha);
  
      if (usuarioExists) {
        return res.status(400).json({ error: "Usuario ja existe." });
      }else if(emailExists){
        return res.status(400).json({ error: "Email ja esta em uso." });
      }

    await Usuario_Freelancer.create({
      cpf: req.body.usuario_freelancer.cpf,
      telefone_fixo: req.body.usuario_freelancer.telefone_fixo,
      telefone_celular: req.body.usuario_freelancer.telefone_celular,
      dt_nascimento: req.body.usuario_freelancer.dt_nascimento,
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
    }).then((usuario_freelancer) => {
      usuario_freelancer.Usuario.senha=undefined;
      return res.status(201).json({
        usuario:usuario_freelancer.Usuario,
        token: generateToken({
          id_usuario: usuario_freelancer.Usuario.id,
          tipo_usuario: usuario_freelancer.Usuario.id_tipo_usuario
        })
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });
  }

  async index(req, res){
    await Usuario_Freelancer.findAll({include:[{model:Endereco, as: "Endereco"}]}).then((usuario) =>{
      return res.status(201).json({
        usuario,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async showByUsuario(req, res){
    const usuario = await Usuario.findOne({where :{id : req.params.usuario}})
    await Usuario_Freelancer.findOne({ where: {id_usuario: usuario.id},
      include:[{model:Endereco, as: "Endereco"}]}).then((usuario_freelancer) =>{
      return res.status(201).json({
        usuario_freelancer,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async showById(req, res){
    await Usuario_Freelancer.findOne({ where: {id: req.params.id},
      include:[{model:Endereco, as: "Endereco"}]}).then((usuario_freelancer) =>{
      return res.status(201).json({
        usuario_freelancer,
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

    const schemaUsuarioFreelancer = Yup.object().shape({
      cpf: Yup.string().required(),
      telefone_fixo:Yup.number(),
      telefone_celular:Yup.number(),
      dt_nascimento: Yup.string().required(),
    });

    if (!(await schemaUsuario.isValid(req.body.usuario))) {
      return res.status(400).json({ error: "Campo usuario não esta de acordo" });
    }

    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(400).json({ error: "Campo endereco não esta de acordo" });
    }

    if (!(await schemaUsuarioFreelancer.isValid(req.body.usuario_freelancer))) {
      return res.status(400).json({ error: "Campo usuario_freelancer não esta de acordo" });
    }

    const emailExists = await Usuario.findOne({
      where: {email: req.body.usuario.email},
    });

    const usuarioExists = await Usuario.findOne({
      where: {usuario: req.body.usuario.usuario},
    });
    

    if (usuarioExists) {
      return res.status(400).json({ error: "Usuario ja existe." });
    }else if(emailExists){
      return res.status(400).json({ error: "Email ja esta em uso." });
    }

    const filtro = {
      where: {id_usuario : req.id_usuario},
      include: [
        {model: Usuario,as: 'Usuario'},
        {model: Endereco, as: "Endereco"}
      ]
    }

    Usuario_Freelancer.findOne(filtro).then(async (usuario_freelancer) =>  {
      if(usuario_freelancer){
        const update_usuario = await usuario_freelancer.Usuario.update(req.body.usuario);
        const update_endereco = await usuario_freelancer.Endereco.update(req.body.endereco);
        const update_usuario_freelancer = await usuario_freelancer.update(req.body.usuario_freelancer)
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
      return res.status(500).json({
        error: "Erro no servidor." 
     })
    })
  }

}

export default new UsuarioFreelancerController();
  