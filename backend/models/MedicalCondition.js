const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const MedSeverity = require('./MedSeverity'); // Import Role model

const MedicalCondition = sequelize.define('MedicalCondition', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  severityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MedSeverity,
      key: 'id',
    },
  },
    description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

MedicalCondition.belongsTo(MedSeverity, { foreignKey: 'severityId' });

module.exports = MedicalCondition;
