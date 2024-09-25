const express = require('express');
const {
  getAllUrgencyLevels,
  getUrgencyLevelById,
  addUrgencyLevel,
  updateUrgencyLevel,
  deleteUrgencyLevel
} = require('../controllers/urgencyController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllUrgencyLevels);
router.get('/:levelId', getUrgencyLevelById);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addUrgencyLevel);
router.put('/:levelId', [authMiddleware, authorize(['superadmin'])], updateUrgencyLevel);
router.delete('/:levelId', [authMiddleware, authorize(['superadmin'])], deleteUrgencyLevel);

module.exports = router;
