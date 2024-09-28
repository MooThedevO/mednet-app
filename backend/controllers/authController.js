const User = require('../models/User');
const Role = require('../models/Role');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

require('dotenv').config();

// User signup (non-admin)
exports.signup = [
    // Validation rules
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('username').notEmpty().withMessage('Username is required'),
    check('roleName').custom(async (roleName) => {
        const role = await Role.findOne({ where: { name: roleName } });
        if(!role) {
          throw new Error("There's no role specified, please enter roleName")
        }
        if (role.name === 'admin' || role.name === 'superadmin') {
            throw new Error('Cannot assign admin or superadmin roles through this route');
        }
        req.role = role; 
    }),
    
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, fullName, phoneNumber, address, profilePicture, roleName } = req.body;

  try {
        // Ensure unique email and username
        const [existingUser, existingUsername] = await Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { username } })
        ]);

        if (existingUser || existingUsername) {
          return res.status(400).json({ error: 'Email or username already in use' });
        }

        // Fetch role from the database dynamically

        const user = await User.create({
          username,
          email,
          password,
          fullName,
          phoneNumber,
          address,
          profilePicture,
          roleId: req.role.id
      });

    // Generate verification token
    const token = generateVerificationToken();
    
      // Save the token in the user record
      user.verificationToken = token;
      await user.save();

      // Send the verification email
      await sendVerificationEmail(email, token);

      res.status(201).json({ message: 'User registered successfully. Please verify your email.', user });
    } catch (error) {
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
}];

// Protected Signup for SuperAdmins to register admins
exports.adminSignup = [
  check('email').isEmail().withMessage('Must be a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('username').notEmpty().withMessage('Username is required'),
  check('roleName').custom(async (roleName) => {
      const role = await Role.findOne({ where: { name: roleName } });
      if(!role) {
        throw new Error("There's no role specified, please enter roleName")
      }
      if (role.name !== 'admin' && role.name !== 'superadmin') {
          throw new Error('Only admin or superadmin roles can be assigned via this route');
      }
      req.role = role;
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, phoneNumber, address, profilePicture, roleName } = req.body;

    try {
      // Ensure unique email and username
      const [existingUser, existingUsername] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { username } })
    ]);

    if (existingUser || existingUsername) {
        return res.status(400).json({ error: 'Email or username already in use' });
    }

    const user = await User.create({
        username,
        email,
        password,
        fullName,
        phoneNumber,
        address,
        profilePicture,
        roleId: req.role.id
    });

    // Generate verification token
    const token = generateVerificationToken();
    
      // Save the token in the user record
      user.verificationToken = token;
      await user.save();
    
    // Send the verification email
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Admin registered successfully. Please verify the email.', user });
  } catch (error) {
    res.status(500).json({ error: 'Error registering admin', details: error.message });
    }
  }
];

//login
exports.login = [
  // Validation
  check('emailOrUsername').notEmpty().withMessage('Email or Username is required'),
  check('password').notEmpty().withMessage('Password is required'),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }

    const { emailOrUsername, password } = req.body;

    try {
      const user = await User.findOne({
          where: {
              [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }]
          }
      });

      if (!user) {
        return res.status(404).json({ message: 'No user found with the provided credentials' });
      }

          // Check if the email is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.SECRET_KEY, { expiresIn: '1h' });

      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// Update user's password
exports.updatePassword =  [
    // Validation
    check('currentPassword').notEmpty().withMessage('Current password is required'),
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params.userId;
      const { currentPassword, newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      try {
          const user = await User.findByPk(userId);
          if (!user) return res.status(404).json({ message: 'User not found' });

          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return res.status(400).json({ error: 'Incorrect current password' });
          }

          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedNewPassword;
          await user.save();

          res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
          res.status(500).json({ error: 'Error updating password', details: error.message });
      }
    }
];

// Update Email or Password (Admin/User)
exports.updateEmailOrPassword = [
  // Validation
  check('oldPassword').notEmpty().withMessage('Old password is required'),
  check('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  check('newEmail').optional().isEmail().withMessage('Must be a valid email'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params.userId;
    const { oldPassword, newPassword, newEmail } = req.body;

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
  }
];

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
// Function to generate a unique token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Function to send a verification email
async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your email',
    html: `<p>Thank you for registering! Please verify your email by entering code ${token} or clicking on the link below:</p>
           <a href="http://localhost:5000/api/auth/verify-email?token=${token}">Verify Email</a>`
  };

  await transporter.sendMail(mailOptions);
}

// Email verification route
exports.verifyMail = async (req, res) => {
  try {
    const { token } = req.query;
    // Find the user with the matching verification token
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(404).json({ message: 'Invalid or expired verification token' });

    // Update the user to set emailVerified to true and remove the token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to verify email', error });
  }
};