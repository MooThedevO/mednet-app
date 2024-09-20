const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('./index');
const Medication = require('./Medication'); // Import Medication model

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {  // New role field (buyer, seller, or donor)
    type: DataTypes.ENUM('buyer', 'seller', 'donor'),
    allowNull: false,
    defaultValue: 'buyer',
  },
  address: {  // New address field
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Association
User.hasMany(Medication, { foreignKey: 'userId' });
Medication.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
