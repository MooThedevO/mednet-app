const express = require('express');
const {
    getAllRoles,
    getRoleById,
    addRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllRoles);
router.get('/:roleId', getRoleById);

// Protected routes (restricted to superadmin)
router.post('/', [authMiddleware, authorize(['superadmin'])], addRole);
router.put('/:roleId', [authMiddleware, authorize(['superadmin'])], updateRole);
router.delete('/:roleId', [authMiddleware, authorize(['superadmin'])], deleteRole);

module.exports = router;
