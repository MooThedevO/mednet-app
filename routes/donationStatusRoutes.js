const express = require('express');
const {
  getAllDonations,
  getDonationById,
  addStatus,
  updateStatus,
  deleteStatus
} = require('../controllers/donationStatusController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllDonations);
router.get('/:statusId', getDonationById);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addStatus);
router.put('/:statusId', [authMiddleware, authorize(['superadmin'])], updateStatus);
router.delete('/:statusId', [authMiddleware, authorize(['superadmin'])], deleteStatus);

module.exports = router;
