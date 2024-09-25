// models/Medication.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const MedicationForm = require('./MedicationForm'); // Import MedicationForm model

const Medication = sequelize.define('Medication', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  activeIngredient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true, // Optional if it's a donation
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  formId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MedicationForm,
      key: 'id',
    },
  },
  storage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Association

Medication.belongsTo(MedicationForm, { foreignKey: 'formId' });

module.exports = Medication;
