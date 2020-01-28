import Sequelize, { Model } from "sequelize";

class Usuario_freelancer extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: Sequelize.STRING,
        id_usuario: Sequelize.INTEGER,
        id_endereco: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
    this.hasOne(models.Curriculo, {as:"Curriculo",foreignKey: 'id_curriculo'});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}

export default Usuario_freelancer;