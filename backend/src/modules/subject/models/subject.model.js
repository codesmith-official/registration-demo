const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Subject = sequelize.define(
  'Subject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'dp_subjects',
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

module.exports = Subject;
