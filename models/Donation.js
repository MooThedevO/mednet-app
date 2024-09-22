// models/Donation.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Donation = sequelize.define('Donation', {
  medicationId: {
    type: DataTypes.INTEGER, // References Medication model
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isMonetary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'awaiting', 'taken', 'cancelled'),
    defaultValue: 'available',
  },
  userId: {
    type: DataTypes.INTEGER, // References the user making the donation
    allowNull: false,
  },  
  anonymous: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Donation;
