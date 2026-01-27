const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const UserTypePermission = sequelize.define(
  'UserTypePermission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'dp_user_type_permissions',
    timestamps: true,
    underscored: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['user_type_id', 'permission_id'],
      },
    ],
  },
);

module.exports = UserTypePermission;
