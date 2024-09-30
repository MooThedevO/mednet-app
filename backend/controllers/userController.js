const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll({ include: [Role] });
      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get specific user by ID
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, { include: [Role] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile', details: error });
  }
};

// Update profile info (not email, password, role, or username)
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { fullName, phoneNumber, address, profilePicture, password } = req.body;

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (!password || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Password is incorrect' });
      }

      user.fullName = fullName || user.fullName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
      user.profilePicture = profilePicture || user.profilePicture

      await user.save();
      res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Search user by username, email, or fullName
exports.searchUser = async (req, res) => {
  const { search } = req.query;

  try {
      const users = await User.findAll({
          where: {
              [Op.or]: [
                  { username: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                  { fullName: { [Op.like]: `%${search}%` } }
              ]
          },
          include: [Role]
      });

      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all soft-deleted users
exports.getDeletedUsers = async (req, res) => {
  try {
      const users = await User.findAll({ where: { isDeleted: true }, include: [Role] });
      res.status(200).json(users);
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Change user's role
exports.changeRole = async (req, res) => {
  const { userId } = req.params;
  const { newRoleName } = req.body;

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const role = await Role.findOne({ where: { name: newRoleName } });
      if (!role) return res.status(404).json({ message: 'Role not found' });

      user.roleId = role.id;
      await user.save();

      res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
      res.status(500).json({ message: 'Error changing user role', error: error.message });
  }
};
