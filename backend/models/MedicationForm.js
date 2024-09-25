const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const MedicationForm = sequelize.define('MedicationForm', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // Optional description field
  },
});

module.exports = MedicationForm;
