import Sequelize, { Model } from 'sequelize';

class Tipo_Deficiencia extends Model {
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

//Tipo_Deficiencia.associate = models => {
//    Tipo_Deficiencia.belongsTo(models.Usuario);
//};

export default Tipo_Deficiencia;
