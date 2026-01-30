'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dp_reports', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'dp_students',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      standard_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dp_standards',
          key: 'id',
        },
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dp_reports');
  },
};
