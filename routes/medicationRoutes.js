// routes/medicationRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { addMedication, getMedications } = require('../controllers/medicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/add',
    authMiddleware,
    [
      body('name').notEmpty().withMessage('Medication name is required'),
      body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
      body('condition').isIn(['new', 'opened']).withMessage('Condition must be "new" or "opened"'),
      body('location').notEmpty().withMessage('Location is required')
    ],
    addMedication
  );
  router.get('/', getMedications); // Public route to view medications

module.exports = router;
