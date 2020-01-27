import * as Yup from "yup";
import Vagas from "../models/Vagas";
import Usuario_Empresa from "../models/Usuario_Empresa";


  class VagasController {
    async store(req, res) {
      const schemaVagas = Yup.object().shape({
        titulo: Yup.string().required(),
        descricao: Yup.string().required(),
        quantidade_vagas: Yup.number().required(),
        usuario_empresa_id: Yup.number().required(),
      });
  
      if (!(await schemaVagas.isValid(req.body.vagas))) {
        return res.status(400).json({ error: "Campo Vagas não esta de acordo" });
      }

      const UsuarioEmpresaExists = await Usuario_Empresa.findOne({
        where: {id: req.body.vagas.usuario_empresa_id},
      });
  
      if (!UsuarioEmpresaExists) {
        return res.status(400).json({ error: "Id do Usuario Empresa informado nao existe" });
      }
      
      const vagas = await Vagas.create(req.body.vagas);
  
      return res.status(201).json({
      vagas:vagas
      });
  }
}

export default new VagasController();
  