const express = require('express');
const {
    getAllConditions,
  getMedCondition,
  addMedCondition,
  updateMedCondition,
  deleteMedCondition
} = require('../controllers/medicalConditionController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllConditions);
router.get('/:conditionId', getMedCondition);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addMedCondition);
router.put('/:conditionId', [authMiddleware, authorize(['superadmin'])], updateMedCondition);
router.delete('/:conditionId', [authMiddleware, authorize(['superadmin'])], deleteMedCondition);

module.exports = router;
