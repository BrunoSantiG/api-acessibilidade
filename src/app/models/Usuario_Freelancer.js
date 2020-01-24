import Sequelize, { Model } from "sequelize";

class Usuario_Freelancer extends Model {
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

Usuario_Freelancer.associate = models => {
  Usuario_Freelancer.hasOne(models.Usuario);
  Usuario_Freelancer.hasOne(models.Endereco);
};

export default Usuario_Freelancer;