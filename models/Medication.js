// models/Medication.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Medication = sequelize.define('Medication', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition: {
    type: DataTypes.ENUM('new', 'opened'),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true, // Optional if it's a donation
  },
  donation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // By default, it's not a donation
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Medication;
