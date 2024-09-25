const express = require('express');
const {
    getAllSeverityLevels,
    getSeverityLevelById,
    addSeverityLevel,
    updateSeverityLevel,
    deleteSeverityLevel
} = require('../controllers/medSeverityController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllSeverityLevels);
router.get('/:levelId', getSeverityLevelById);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addSeverityLevel);
router.put('/:levelId', [authMiddleware, authorize(['superadmin'])], updateSeverityLevel);
router.delete('/:levelId', [authMiddleware, authorize(['superadmin'])], deleteSeverityLevel);

module.exports = router;
