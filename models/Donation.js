// models/Donation.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Medication = require('./Medication');
const User = require('./User');
const DonationStatus = require('./DonationStatus');

const Donation = sequelize.define('Donation', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  medicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medication,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DonationStatus,
      key: 'id'
    }
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
});

Donation.belongsTo(Medication, { foreignKey: 'medicationId' });
Donation.belongsTo(DonationStatus, { foreignKey: 'statusId' });
Donation.belongsTo(User, { foreignKey: 'userId' });

module.exports = Donation;
