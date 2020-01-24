import Sequelize, { Model } from 'sequelize';

class Endereco extends Model {
  static init(sequelize) {
    super.init(
      {
        pais: Sequelize.STRING,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        bairro: Sequelize.STRING,
        cep: Sequelize.INTEGER,
        logradouro: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

//endereco.associate = models => {
//    endereco.belongsTo(models.Usuario);
//};

export default Endereco;
