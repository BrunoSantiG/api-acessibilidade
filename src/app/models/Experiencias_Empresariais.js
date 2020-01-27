import Sequelize, { Model } from "sequelize";

class Experiencias_empresariais extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        cargo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        entrada: Sequelize.DATE,
        saida: Sequelize.DATE,
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Experiencias_empresariais;
