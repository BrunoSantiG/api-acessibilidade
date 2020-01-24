import Sequelize, { Model } from 'sequelize';

class Proposta extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario_freelancer_cpf: Sequelize.STRING,
        usuario_empresa_cnpj: Sequelize.STRING,
        valor: Sequelize.DOUBLE,
        mensagem: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
Proposta.associate = models => {
  Usuario_Pcd.hasOne(models.Usuario_Freelancer);
  Usuario_Pcd.hasOne(models.Usuario_Pcd);
};

export default Proposta;