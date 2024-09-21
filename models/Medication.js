// models/Medication.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

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
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  form: {
    type: DataTypes.ENUM('tablet', 'liquid', 'injection', 'capsule'),
    allowNull: false,
  },
  storage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Medication;
