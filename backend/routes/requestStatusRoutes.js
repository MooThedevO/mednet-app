const express = require('express');
const {
  getAllStatuses,
  getStatusById,
  addStatus,
  updateStatus,
  deleteStatus
} = require('../controllers/requestStatusController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllStatuses);
router.get('/:statusId', getStatusById);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addStatus);
router.put('/:statusId', [authMiddleware, authorize(['superadmin'])], updateStatus);
router.delete('/:statusId', [authMiddleware, authorize(['superadmin'])], deleteStatus);

module.exports = router;
