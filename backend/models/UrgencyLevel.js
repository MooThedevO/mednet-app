const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const UrgencyLevel = sequelize.define('UrgencyLevel', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = UrgencyLevel;
