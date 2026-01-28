'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('dp_students', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      after: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('dp_students', 'user_id');
  },
};
