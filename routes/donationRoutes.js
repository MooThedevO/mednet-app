// routes/donationRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { addDonation, getDonations, updateDonation, deleteDonation } = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/add',
  authMiddleware(),
  [
    body('medicationId').notEmpty().withMessage('Medication ID is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
    body('isMonetary').isBoolean().withMessage('Must specify if the donation is monetary or not'),
    body('anonymous').isBoolean().withMessage('Anonymous flag is required')
  ],
  addDonation
);

router.get('/', authMiddleware(), getDonations);
router.put('/:id', authMiddleware(), updateDonation);
router.delete('/:id', authMiddleware(), deleteDonation);

module.exports = router;
