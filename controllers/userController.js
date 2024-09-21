// controllers/userController.js
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['username', 'email', 'fullName', 'phoneNumber', 'address', 'profilePicture', 'role'],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile', details: error });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { fullName, phoneNumber, address, profilePicture } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', details: error });
  }
};
