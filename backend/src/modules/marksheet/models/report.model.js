const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Report = sequelize.define(
  'Report',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    standard_id: DataTypes.INTEGER,
    percentage: DataTypes.DECIMAL(5, 2),
  },
  {
    tableName: 'dp_reports',
    timestamps: true,
    underscored: true,
  },
);

module.exports = Report;
