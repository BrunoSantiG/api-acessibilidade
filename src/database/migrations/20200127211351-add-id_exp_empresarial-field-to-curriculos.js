module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('curriculos', 'id_exp_empresarial', {
      type: Sequelize.INTEGER,
      references: { model: 'experiencias_empresariais', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('curriculos', 'id_exp_empresarial');
  },
};