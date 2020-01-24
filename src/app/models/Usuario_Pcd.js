import Sequelize, { Model } from "sequelize";

class Usuario_pcd extends Model {
  static init(sequelize) {
    super.init(
      {
        rg: Sequelize.STRING,
        dt_nascimento: Sequelize.STRING,
        laudo_verificado: Sequelize.STRING,
        laudo_url: Sequelize.STRING,
        id_tipo_deficiencia: Sequelize.INTEGER,
        id_usuario: Sequelize.INTEGER,
        id_curriculo: Sequelize.INTEGER,
        id_endereco: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    return this;
  }
}

Usuario_pcd.associate = models => {
  Usuario_pcd.hasOne(models.Tipo_Deficiencia);
  Usuario_pcd.hasOne(models.Usuario);
  Usuario_pcd.hasOne(models.Curriculo);
  Usuario_pcd.hasOne(models.Endereco);
};

export default Usuario_pcd;
