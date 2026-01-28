'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('dp_users', 'role');

    await queryInterface.addColumn('dp_users', 'user_type_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('dp_users', 'role', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('dp_users', 'user_type_id');
  },
};
