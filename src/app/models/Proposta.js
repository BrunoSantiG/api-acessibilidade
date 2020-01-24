import Sequelize, { Model } from 'sequelize';

class Proposta extends Model {
  static init(sequelize) {
    super.init(
      {
        usuario_freelancer_id: Sequelize.INTEGER,
        usuario_empresa_id: Sequelize.INTEGER,
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
  Proposta.hasOne(models.Usuario_Freelancer);
  Proposta.hasOne(models.Empresa);
};

export default Proposta;