module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proposta', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario_freelancer_cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "usuario_freelancer",
          key: "cpf"
        },
        onDelete: "CASCADE"
      },
      usuario_empresa_cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "usuario_empresa",
          key: "cnpj"
        },
        onDelete: "CASCADE"
      },
      valor: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
  });
},

  down: (queryInterface) => {
    return queryInterface.dropTable('proposta');
  }
};
