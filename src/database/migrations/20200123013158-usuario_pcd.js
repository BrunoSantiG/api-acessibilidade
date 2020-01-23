module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usuario_pcd', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      rg:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true,
      },
      dt_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      laudo_verificado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false,
        
      },
      laudo_url:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_tipo_deficiencia: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipo_deficiencia',
          key: 'id', 
        },
        onDelete:'CASCADE',
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id', 
        },
        onDelete:'CASCADE',
      },
      id_curriculo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'curriculo',
          key: 'id', 
        },
        onDelete:'CASCADE',
      },
      id_endereco: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'endereco',
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

  down: queryInterface => {
    return queryInterface.dropTable('usuario_pcd');
  },
};