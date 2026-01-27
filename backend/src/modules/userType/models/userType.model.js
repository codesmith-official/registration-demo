const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const UserType = sequelize.define(
  'UserType',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'dp_usertypes',
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

module.exports = UserType;
