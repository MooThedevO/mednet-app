const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const RequestStatus = sequelize.define('RequestStatus', {
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

module.exports = RequestStatus;
