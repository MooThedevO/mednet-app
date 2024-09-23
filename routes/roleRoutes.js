const express = require('express');
const {
    getAllRoles,
    getRoleById,
    addRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllRoles);
router.get('/:roleId', getRoleById);

// Protected routes (restricted to superadmin)
router.post(
    '/',
    [
      authMiddleware,
      authorize(['superadmin']),
      check('name', 'Role name is required').notEmpty(),
      check('name', 'Role name should be between 3 and 50 characters').isLength({ min: 3, max: 50 }),
    ],
    addRole
  );
  
router.put(
    '/:roleId',
    [
      authMiddleware,
      authorize(['superadmin']),
      check('name', 'Role name should be between 3 and 50 characters').optional().isLength({ min: 3, max: 50 }),
    ],
    updateRole
  );
  
router.delete('/:roleId', [authMiddleware, authorize(['superadmin'])], deleteRole);

module.exports = router;
