import * as Yup from "yup";
import Vagas from "../models/Vagas";
import Usuario_Empresa from "../models/Usuario_Empresa";
import Endereco from "../models/Endereco";
import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
const routes = new Router();

  class VagasController {
    async store(req, res) {

      const schemaVagas = Yup.object().shape({
        titulo: Yup.string().required(),
        descricao: Yup.string().required(),
        quantidade_vagas: Yup.number().required(),
        usuario_empresa_id: Yup.number().required(),
        id_endereco: Yup.number().required(),
      });
  
      if (!(await schemaVagas.isValid(req.body.vagas))) {
        return res.status(400).json({ error: "Campo Vagas não esta de acordo" });
      }

      const UsuarioEmpresaExists = await Usuario_Empresa.findOne({
        where: {id: req.body.vagas.usuario_empresa_id},
      });
      const EnderecoExists = await Endereco.findOne({
        where: {id: req.body.vagas.id_endereco},
      });
  
      if (!UsuarioEmpresaExists) {
        return res.status(400).json({ error: "Id do Usuario Empresa informado nao existe" });
      }
      if (!EnderecoExists) {
        return res.status(400).json({ error: "Id do Endereco informado nao existe" });
      }
  
      await Vagas.create({
        titulo: req.body.vagas.titulo,
        descricao: req.body.vagas.descricao,
        quantidade_vagas: req.body.vagas.quantidade_vagas,
        usuario_empresa_id: req.body.vagas.usuario_empresa_id,
        id_endereco: req.body.vagas.id_endereco,
      }, {
        include: [
          {model: Usuario_Empresa, as: 'Usuario_Empresa'},
          {model: Endereco, as: "Endereco"}],
      }).then((vagas) => {
        return res.status(201).json({
            vagas
          })
      }).catch((err)=>{
        console.log("ERRO: "+err)
      });
  }

  async index(req, res){
    await Vagas.findAll({include:[{model:Usuario_Empresa, as: "Usuario_Empresa"}, {model:Endereco, as: "Endereco"}]})
    .then((vagas) =>{
      return res.status(201).json({
        vagas,
    });
    }).catch((err)=>{
      console.log("ERRO: " +err)
    })
  }

  async showById(req, res){
    await Vagas.findOne({ where: {id: req.params.id},
      include:[{model:Usuario_Empresa, as: "Usuario_Empresa"}, {model:Endereco, as: "Endereco"}]})
    .then((vagas) =>{
      return res.status(201).json({
        vagas,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async showByEmpresas(req, res){
    routes.use(authMiddleware);
    const usuario_empresa = await Usuario_Empresa.findOne({where :{id : req.params.id}})
    await Vagas.findOne({ where: {id: usuario_empresa.id},
      include:[{model:Endereco, as: "Endereco"}]})
    .then((vagas) =>{
      return res.status(201).json({
        vagas,
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async delete(req, res) {
    
    await Vagas.destroy({ where: {id: req.params.id}})
    .then(() =>{
      return res.status(201).json({
        message: "Vaga excluida com sucesso"
    });
    }).catch((err)=>{
      console.log("ERRO: "+err)
    })
  }

  async update(req, res) {

    await Vagas.update({
      titulo: req.body.vagas.titulo,
      descricao: req.body.vagas.descricao,
      quantidade_vagas: req.body.vagas.quantidade_vagas,
      }, {
        where: { id: req.params.id },
        returning: true,
        plain: true,
        include:[{model:Usuario_Empresa, as: "Usuario_Empresa"}, {model:Endereco, as: "Endereco"}],
      })
      .then((vagas) =>{
        return res.status(201).json({
          vagas,
      });
      }).catch((err)=>{
        console.log("ERRO: "+err)
      })
  }
}

export default new VagasController();