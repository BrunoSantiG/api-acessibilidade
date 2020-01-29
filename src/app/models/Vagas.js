import Sequelize, { Model } from 'sequelize';

class Vagas extends Model {
  static init(sequelize) {
    super.init(
      {
        ativo: Sequelize.BOOLEAN,
        titulo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        quantidade_vagas: Sequelize.INTEGER,
        usuario_empresa_id: Sequelize.INTEGER,
        id_endereco: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario_empresa, {as:"Usuario_Empresa", foreignKey: "usuario_empresa_id"});
    this.belongsTo(models.Endereco, {as:"Endereco", foreignKey: "id_endereco"});
};
}


export default Vagas;