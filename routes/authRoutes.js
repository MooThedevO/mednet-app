const express = require('express');
const {
    signup, 
    adminSignup, 
    login, 
    updateEmailOrPassword, 
    deleteUser, 
    blockUser
  } = require('../controllers/authController');
const { authMiddleware, authorize, authorizeSelf } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (admin/superadmin access)
router.post('/admin/signup', [authMiddleware, authorize(['superadmin'])], adminSignup);
router.put('/user/:userId/update-email-password', [authMiddleware, authorizeSelf()], updateEmailOrPassword);
router.delete('/user/:userId/delete', [authMiddleware, authorizeSelf()], deleteUser);
router.put('/user/:userId/block', [authMiddleware, authorize(['admin', 'superadmin'])], blockUser);

module.exports = router;
