const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Standard = sequelize.define(
  'Standard',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    standard: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'dp_standards',
    timestamps: true,
    paranoid: false,
    underscored: true,
  },
);

module.exports = Standard;
