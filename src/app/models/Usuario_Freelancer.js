import Sequelize, { Model } from "sequelize";

class Usuario_freelancer extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: Sequelize.STRING,
        id_usuario: Sequelize.INTEGER,
        id_endereco: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

Usuario_freelancer.associate = models => {
  Usuario_freelancer.hasOne(models.Usuario);
  Usuario_freelancer.hasOne(models.Endereco);
};

export default Usuario_freelancer;