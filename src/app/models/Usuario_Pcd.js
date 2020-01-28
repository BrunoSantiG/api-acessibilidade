
import Sequelize, { Model } from "sequelize";

class Usuario_pcd extends Model {
  static init(sequelize) {
    super.init(
      {
        rg: Sequelize.STRING,
        dt_nascimento: Sequelize.STRING,
        laudo_verificado: Sequelize.STRING,
        laudo_url: Sequelize.STRING,
        id_curriculo: Sequelize.INTEGER,
      },
      {
        sequelize
      }
    );
    return this;
  }
  static associate (models){
    this.belongsTo(models.Tipo_deficiencia, {as:"Tipo_Deficiencia",foreignKey: 'id_tipo_deficiencia'});
    this.belongsTo(models.Usuario, {as:"Usuario",foreignKey: 'id_usuario'});
    this.belongsTo(models.Curriculo, {as:"Curriculo",foreignKey: 'id_curriculo'});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
  };
}



export default Usuario_pcd;
