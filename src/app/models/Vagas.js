import Sequelize, { Model } from 'sequelize';

class Vagas extends Model {
  static init(sequelize) {
    super.init(
      {
        ativo: Sequelize.BOOLEAN,
        titulo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        quantidade_vagas: Sequelize.INTEGER,
        usuario_empresa_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
Vagas.associate = models => {
    Vagas.hasOne(models.Usuario_Empresa);
};

export default Vagas;