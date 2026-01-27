const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/sequelize');

const StandardSubject = sequelize.define(
  'StandardSubject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    standard_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'dp_standard_subjects',
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
);

module.exports = StandardSubject;
