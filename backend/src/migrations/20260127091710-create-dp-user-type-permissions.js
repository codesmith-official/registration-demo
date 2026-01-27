'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dp_user_type_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      user_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addConstraint('dp_user_type_permissions', {
      fields: ['user_type_id', 'permission_id'],
      type: 'unique',
      name: 'uniq_user_type_permission',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dp_user_type_permissions');
  },
};
