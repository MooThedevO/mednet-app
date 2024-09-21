const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

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

  const { username, email, password, fullName, phoneNumber, address, profilePicture, role } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      phoneNumber,
      address,
      profilePicture,
      role,
    });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user', details: error });
  }
}];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error });
  }
};

exports.updateUser = async (req, res) => {
  const { username, email } = req.body;
  if (req.user.id != req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to update this user' });
  }

  try {
    await User.update({ username, email }, { where: { id: req.params.id } });
    res.json({ message: 'User updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword)
  try {
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log(isMatch)
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashedPassword });
    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password', details: error });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.user.id != req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to delete this user' });
  }

  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error });
  }
};