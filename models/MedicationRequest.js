// models/MedicationRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const MedicationRequest = sequelize.define('MedicationRequest', {
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  urgency: {
    type: DataTypes.ENUM('immediate', 'within a week', 'not urgent'),
    allowNull: false,
  },
  medicalCondition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  doctorPrescription: {
    type: DataTypes.STRING, // Could be a URL or file path to a prescription file
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'),
    defaultValue: 'pending',
  },
  type: {
    type: DataTypes.ENUM('buy', 'free'),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = MedicationRequest;