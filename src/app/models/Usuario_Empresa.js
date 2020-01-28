import Sequelize, { Model } from "sequelize";

class Usuario_empresa extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.STRING,
        razao_social: Sequelize.STRING,
        telefone_fixo:Sequelize.INTEGER,
        telefone_celular:Sequelize.INTEGER,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate = models => {
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
      this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}



export default Usuario_empresa;
