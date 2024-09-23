const express = require('express');
const {
    getAllUsers, 
    getUserProfile, 
    searchUser, 
    updateUserProfile,
    getDeletedUsers,
    changeRole
} = require('../controllers/userController');
const { authMiddleware, authorizeSelf, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (user/admin/superadmin access)
router.get('/', getAllUsers);
router.get('/get-deleted',getDeletedUsers);
router.get('/:userId', getUserProfile);
router.get('/search', searchUser);
router.put('/:userId/update-profile', [authMiddleware, authorizeSelf()], updateUserProfile);
router.put('/:userId/update-role', [authMiddleware, authorize(['superadmin'])], changeRole);

module.exports = router;
