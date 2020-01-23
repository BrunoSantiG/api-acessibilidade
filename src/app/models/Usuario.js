import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        usuario: Sequelize.STRING,
        senha: Sequelize.STRING,
        id_tipo_usuario: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.senha) {
        user.senha = await bcrypt.hash(user.senha, 10);
      }
    });
    return this;
  }
}

Usuario.associate = models => {
  Usuario.hasOne(models.Tipo_Usuario);
};

export default Usuario;
