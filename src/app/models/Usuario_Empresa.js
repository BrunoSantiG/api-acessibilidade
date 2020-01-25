import Sequelize, { Model } from "sequelize";

class Usuario_empresa extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.STRING,
        razao_social: Sequelize.STRING,
        id_endereco: Sequelize.INTEGER,
        id_usuario: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

Usuario_empresa.associate = models => {
  Usuario_empresa.hasOne(models.Endereco);
  Usuario_empresa.hasOne(models.Usuario);
};

export default Usuario_empresa;
