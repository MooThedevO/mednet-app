// routes/userRoutes.js
const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { updateUser, updatePassword, deleteUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authMiddleware(), getUserProfile); // Retrieve user profile
router.put('/profile', authMiddleware(), updateUserProfile); // Update user profile

router.put('/:id', authMiddleware(), updateUser); // Update user info
router.put('/:id/password', authMiddleware(), updatePassword); // Update password
router.delete('/:id', authMiddleware(), deleteUser); // Delete user

module.exports = router;