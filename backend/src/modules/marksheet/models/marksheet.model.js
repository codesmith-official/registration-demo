const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const Marksheet = sequelize.define(
  'Marksheet',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: DataTypes.INTEGER,
    standard_id: DataTypes.INTEGER,
    subject_id: DataTypes.INTEGER,
    marks: DataTypes.INTEGER,
  },
  {
    tableName: 'dp_marksheets',
    timestamps: true,
    underscored: true,
  },
);

module.exports = Marksheet;
