'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dp_user_standards', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dp_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      standard_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dp_standards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // prevent duplicate user-standard mapping
    await queryInterface.addConstraint('dp_user_standards', {
      fields: ['user_id', 'standard_id'],
      type: 'unique',
      name: 'uq_dp_user_standards_user_standard',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dp_user_standards');
  },
};
