module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vagas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:true,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      quantidade_vagas: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      usuario_empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuario_empresas",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      id_endereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'enderecos',
          key: 'id', 
        },
        onDelete:'CASCADE',
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
    return queryInterface.dropTable('vagas');
  }
};
