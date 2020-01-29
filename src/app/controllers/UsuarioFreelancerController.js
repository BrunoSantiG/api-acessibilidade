import * as Yup from "yup";
import jwt from 'jsonwebtoken';
import Usuario from "../models/Usuario";
import Curriculo from "../models/Curriculo";
import Usuario_Freelancer from "../models/Usuario_Freelancer";
import Endereco from "../models/Endereco";
import authConfig from '../../config/auth';

function generateToken(params = {}){
    const token = jwt.sign(params,authConfig.secret,{
        expiresIn: 86400,
    });
    return token;
  }

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
      })
    }).catch((err)=>{
      console.log("ERRO: "+err)
    });
  }
}

export default new UsuarioFreelancerController();
  