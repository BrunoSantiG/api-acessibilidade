module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('curriculos', 'id_qual_adicional', {
      type: Sequelize.INTEGER,
      references: { model: 'qualificacoes_adicionais', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('curriculos', 'id_qual_adicional');
  },
};