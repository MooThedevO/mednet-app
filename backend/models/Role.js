const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: "Role name cannot be empty" },
      len: {
        args: [3, 50],
        msg: "Role name must be between 3 and 50 characters",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: "Description can't be longer than 255 characters",
      },
    },
  },
});

module.exports = Role;
