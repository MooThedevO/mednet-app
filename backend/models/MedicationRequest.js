const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const Medication = require('./Medication');
const UrgencyLevel = require('./UrgencyLevel');
const MedicalCondition = require('./MedicalCondition')
const RequestStatus = require('./RequestStatus');

const MedicationRequest = sequelize.define('MedicationRequest', {
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
    allowNull: false
  },
  urgencyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UrgencyLevel,
      key: 'id'
    }
  },
  conditionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MedicalCondition,
      key: 'id'
    }
},
  doctorPrescription: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isDonation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  statusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RequestStatus,
      key: 'id'
    }
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

// Associations
MedicationRequest.belongsTo(User, { foreignKey: 'userId' });
MedicationRequest.belongsTo(UrgencyLevel, { foreignKey: 'urgencyId' });
MedicationRequest.belongsTo(RequestStatus, { foreignKey: 'statusId' });
MedicationRequest.belongsTo(MedicalCondition, { foreignKey: 'conditionId' });
MedicationRequest.belongsTo(Medication, { foreignKey: 'medicationId' });

module.exports = MedicationRequest;
