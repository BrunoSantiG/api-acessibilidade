import Sequelize, { Model } from "sequelize";

class Qualificacoes_adicionais extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Qualificacoes_adicionais;
