// routes/medicationRequestRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { addMedicationRequest, getMedicationRequests, updateMedicationRequest, deleteMedicationRequest } = require('../controllers/medicationRequestController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/add',
  authMiddleware(),
  [
    body('medicationName').notEmpty().withMessage('Medication name is required'),
    body('urgency').isIn(['immediate', 'within a week', 'not urgent']).withMessage('Urgency must be one of the specified values'),
    body('type').isIn(['buy', 'free']).withMessage('Type must be either "buy" or "free"')
  ],
  addMedicationRequest
);

router.get('/', authMiddleware(), getMedicationRequests);
router.put('/:id', authMiddleware(), updateMedicationRequest);
router.delete('/:id', authMiddleware(), deleteMedicationRequest);

module.exports = router;
