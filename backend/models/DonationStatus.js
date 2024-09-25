const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const DonationStatus = sequelize.define('DonationStatus', {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = DonationStatus;
