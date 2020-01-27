module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('curriculos', 'id_exp_academica', {
      type: Sequelize.INTEGER,
      references: { model: 'experiencias_academicas', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('curriculos', 'id_exp_academica');
  },
};