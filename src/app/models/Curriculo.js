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

//Curriculo.associate = models => {
//    Curriculo.belongsTo(models.Usuario);
//};

export default Curriculo;
