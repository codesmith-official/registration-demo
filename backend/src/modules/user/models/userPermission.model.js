const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const UserPermission = sequelize.define(
  'UserPermission',
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

    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'dp_user_permissions',
    underscored: true,
    timestamps: true,
    paranoid: false,
  },
);

module.exports = UserPermission;
