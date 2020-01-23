module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usuario_pcd", {
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      razao_social: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_endereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "endereco",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("usuario_pcd");
  }
};
