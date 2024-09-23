const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Role = sequelize.define('Role', {
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

module.exports = Role;
