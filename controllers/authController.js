const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');

require('dotenv').config();

// User signup (non-admin)
exports.signup = [
    // Validation rules
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('username').notEmpty().withMessage('Username is required'),
  
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password, fullName, phoneNumber, address, profilePicture, roleName } = req.body;

  try {
        // Ensure unique email and username
        const existingUser = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingUser || existingUsername) {
          return res.status(400).json({ error: 'Email or username already in use' });
        }

        // Fetch role from the database dynamically
        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) return res.status(400).json({ message: 'Role not found' });

        // Prevent assigning admin/superadmin roles via this route
        if (!role || role.name === 'admin' || role.name === 'superadmin') {
          return res.status(403).json({ error: 'Cannot assign admin roles through this route' });
        }

    const user = await User.create({
      username,
      email,
      password,
      fullName,
      phoneNumber,
      address,
      profilePicture,
      roleId:role.id
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user', details: error });
  }
}];

// Protected Signup for SuperAdmins to register admins
exports.adminSignup = [
  check('email').isEmail().withMessage('Must be a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('username').notEmpty().withMessage('Username is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, phoneNumber, address, profilePicture, roleName } = req.body;

    try {
      // Ensure unique email and username
      const existingUser = await User.findOne({ where: { email } });
      const existingUsername = await User.findOne({ where: { username } });

      if (existingUser || existingUsername) {
        return res.status(400).json({ error: 'Email or username already in use' });
      }
    
      // Fetch role from the database dynamically
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) return res.status(400).json({ message: 'Role not found' });

      if (role.name !== 'admin' && role.name !== 'superadmin') {
        return res.status(403).json({ error: 'Only admin or superadmin roles can be assigned via this route' });
      }

      const user = await User.create({
        username,
        email,
        password,
        fullName,
        phoneNumber,
        address,
        profilePicture,
        roleId:role.id
      });

      res.status(201).json({ message: 'Admin registered successfully!' });
    } catch (error) {
      res.status(400).json({ error: 'Error registering admin', details: error });
    }
  }
];

//login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { emailOrUsername, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      where: {
          [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
      }
   });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid Password' });

    const token = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error });
  }
};

// Update Email or Password (Admin/User)
exports.updateEmailOrPassword = async (req, res) => {
  const { userId } = req.params.userId;
  const { oldPassword, newPassword, newEmail } = req.body;
  const requestingUser = req.user; // User from the authMiddleware

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
      if (newEmail) user.email = newEmail;

      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { userId } = req.params.userId;

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.isDeleted = true;
      await user.save();

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// block/UnBlock User
exports.blockUser = async (req, res) => {
  const { userId } = req.params.userId;
  const requestingUser = req.user;

  try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const targetUserRole = await Role.findByPk(user.roleId);

      // Superadmins cannot be blocked by anyone
      if (targetUserRole.name === 'superadmin') {
        return res.status(403).json({ message: 'Superadmins cannot be blocked' });
      }
      // Admins can only be blocked/unblocked by superadmins
      if (targetUserRole.name === 'admin' && requestingUser.roleName !== 'superadmin') {
        return res.status(403).json({ message: 'Only superadmins can block/unblock admins' });
      }
  
      // Allow blocking/unblocking for regular users by admin/superadmin
      user.isBlocked = !user.isBlocked; // Toggle block status
      await user.save();

      res.status(200).json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};