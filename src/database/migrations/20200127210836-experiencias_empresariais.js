module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('experiencias_empresariais', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cargo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,        
      },
      entrada: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      saida: {
        type: Sequelize.DATE,
        allowNull: true,
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

  down: queryInterface => {
    return queryInterface.dropTable('experiencias_empresariais');
  },
};