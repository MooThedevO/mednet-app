const express = require('express');
const {
    getAllUsers, 
    getUserProfile, 
    searchUser, 
    updateUserProfile
} = require('../controllers/userController');
const { authMiddleware, authorizeSelf } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (user/admin/superadmin access)
router.get('/', getAllUsers);
router.get('/:userId', getUserProfile);
router.get('/search', searchUser);
router.put('/:userId/update-profile', [authMiddleware, authorizeSelf()], updateUserProfile);

module.exports = router;
