const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const MedSeverity = sequelize.define('MedSeverity', {
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
    description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = MedSeverity;
