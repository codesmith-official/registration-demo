const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM('admin', 'user', 'viewer'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'dp_users',
    timestamps: true,
    paranoid: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  },
);

module.exports = User;
