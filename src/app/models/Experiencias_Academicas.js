import Sequelize, { Model } from "sequelize";

class Experiencias_academicas extends Model {
  static init(sequelize) {
    super.init(
      {
        instituicao: Sequelize.STRING,
        curso: Sequelize.STRING,
        entrada: Sequelize.DATE,
        saida: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }
}

export default Experiencias_academicas;
