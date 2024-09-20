// routes/medicationRoutes.js
const express = require('express');
const { addMedication, getMedications } = require('../controllers/medicationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addMedication); // Only logged-in users can add medications
router.get('/', getMedications); // Public route to view medications

module.exports = router;
