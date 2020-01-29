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
        id_usuario_empresa: Yup.number().required(),
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

      if (!(await schemaVagas.isValid(req.body.vagas))) {
        return res.status(400).json({ error: "Campo Vagas não esta de acordo" });
      }
      if (!(await schemaEndereco.isValid(req.body.endereco))) {
        return res.status(200).json({ error: "Campo endereco não esta de acordo" });
      }

      const UsuarioEmpresaExists = await Usuario_Empresa.findOne({
        where: {id: req.body.vagas.id_usuario_empresa},
      });
  
      if (!UsuarioEmpresaExists) {
        return res.status(400).json({ error: "Id do Usuario Empresa informado nao existe" });
      }
  
      await Vagas.create({
        titulo: req.body.vagas.titulo,
        descricao: req.body.vagas.descricao,
        quantidade_vagas: req.body.vagas.quantidade_vagas,
        id_usuario_empresa: req.body.vagas.id_usuario_empresa,
        Endereco:req.body.endereco,
      }, {
        include: [
          {model: Usuario_Empresa, as: 'Usuario_Empresa'},
          {model: Endereco, as: "Endereco"}],
      }).then((vagas) => {
        return res.status(201).json({
          vagas:{
          id:vagas.id,
          id_usuario_empresa:vagas.id_usuario_empresa,
          id_endereco:vagas.id_endereco,
          }
        })
      }).catch((err)=>{
        console.log("ERRO: "+err)
      });
  }

  async index(req, res){
    await Vagas.findAll({
      include:[{model:Usuario_Empresa, as: "Usuario_Empresa", attributes: ['id', 'razao_social']},
      {model:Endereco, as: "Endereco", attributes: ['id', 'pais', 'estado', 'cidade']}],
      attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas'],
      order: [['id', 'ASC']],
    })
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
      include:[{model:Usuario_Empresa, as: "Usuario_Empresa", 
        attributes: ['id', 'cnpj', 'razao_social', 'telefone_fixo', 'telefone_celular']},
      {model:Endereco, as: "Endereco", 
        attributes: ['id', 'pais', 'estado', 'cidade', 'bairro', 'cep', 'logradouro', 'numero', 'complemento']}],
      attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas'],
    })
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

    await Vagas.findAll({where :{id_usuario_empresa : req.params.id},
      include: {model:Endereco, as: "Endereco", attributes: ['id', 'pais', 'estado', 'cidade']},
      attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas'],
      order: [['id', 'ASC']],
      })
      .then((vagas) =>{
            return res.status(201).json({
              vagas,
          });
      }).catch((err)=>{
        console.log("ERRO: "+err)
      })
  }

  async delete(req, res) {

    const vagas = await Vagas.findOne({ where: {id: req.params.id}, include: {model:Endereco, as: "Endereco"}});

    await Endereco.destroy({ where: {id: vagas.id_endereco}})
    await Vagas.destroy({ where: {id: req.params.id}})
    .then(() =>{
      return res.status(201).json({
        message: "Vaga deletada com sucesso!"
    });
    }).catch((err)=>{
      console.log("ERRO: " + err)
    })
  }

  async update(req, res) {

    const schemaVagas = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      quantidade_vagas: Yup.number(),
      id_usuario_empresa: Yup.number(),
    });

    const schemaEndereco = Yup.object().shape({
      pais: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      bairro: Yup.string(),
      cep: Yup.number(),
      logradouro: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
    });

    if (!(await schemaVagas.isValid(req.body.vagas))) {
      return res.status(400).json({ error: "Campo Vagas não esta de acordo" });
    }
    if (!(await schemaEndereco.isValid(req.body.endereco))) {
      return res.status(200).json({ error: "Campo endereco não esta de acordo" });
    }

    const vagas = await Vagas.findOne({ where: {id: req.params.id}})

    if (!vagas) {
      return res.status(200).json({ error: "Id do Usuario Empresa informado nao existe" });
    }

    await Vagas.update({
      ativo: req.body.vagas.ativo,
      titulo: req.body.vagas.titulo,
      descricao: req.body.vagas.descricao,
      quantidade_vagas: req.body.vagas.quantidade_vagas,
      },
      {
        where: { id: req.params.id },
        returning: true,
        plain: true,
      })
    await Endereco.update({
      pais: req.body.endereco.pais,
      estado: req.body.endereco.estado,
      },
      {
        where: { id: vagas.id_endereco},
        returning: true,
        plain: true,
      })
      const vaga = await Vagas.findOne({ where: {id: req.params.id}, 
      include: {model:Endereco, as: "Endereco", 
        attributes: ['id', 'pais', 'estado', 'cidade', 'bairro', 'cep', 'logradouro', 'numero', 'complemento']},
      attributes: ['id', 'ativo', 'titulo', 'descricao', 'quantidade_vagas']
     })
      .then((vaga) =>{
        return res.status(201).json({ 
          vaga
      });
      }).catch((err)=>{
        console.log("ERRO: "+err)
      })
  }
}

export default new VagasController();