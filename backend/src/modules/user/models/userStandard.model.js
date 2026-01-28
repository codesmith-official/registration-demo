const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const UserStandard = sequelize.define(
  'UserStandard',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    standardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'principal user id',
    },
  },
  {
    tableName: 'dp_user_standards',
    underscored: true,
    timestamps: true,
    paranoid: false,
  },
);

module.exports = UserStandard;
