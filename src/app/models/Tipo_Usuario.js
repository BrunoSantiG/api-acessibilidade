import Sequelize, { Model } from 'sequelize';

class Tipo_Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        tipo: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Tipo_Usuario;
