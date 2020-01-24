import Sequelize, { Model } from 'sequelize';

class Curriculo extends Model {
  static init(sequelize) {
    super.init(
      {
        objetivo: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Curriculo;
