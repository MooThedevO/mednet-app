const express = require('express');
const {
  getAllDonations,
  getDonationById,
  addDonation,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');
const { authMiddleware, authorizeSelf } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllDonations);
router.get('/:donationId', getDonationById);

// Protected routes
router.post('/', [authMiddleware], addDonation);
router.put('/:donationId', [authMiddleware, authorizeSelf()], updateDonation);
router.delete('/:donationId', [authMiddleware, authorizeSelf()], deleteDonation);

module.exports = router;
