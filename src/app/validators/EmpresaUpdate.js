import * as Yup from "yup";

export default async (req, res, next) => {
  try {
    const schemaUsuarioEmpresa = Yup.object().shape({
      cnpj: Yup.string(),
      razao_social: Yup.string(),
      telefone_fixo: Yup.number(),
      telefone_celular: Yup.number()
    });

    await schemaUsuarioEmpresa.validate(req.body.usuario_empresa, {
      abortEarly: false
    });

    return next();
  } catch (err) {
    return res.status(423).json({
      error: "Campo usuario empresa não esta de acordo",
      messages: err.inner
    });
  }
};
