// routes/medicationRoutes.js
const express = require('express');
const { getAllMedications, getMedicationById, addMedication, updateMedication, deleteMedication } = require('../controllers/medicationController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllMedications);
router.get('/:medId', getMedicationById);

// Protected routes
router.post('/', [authMiddleware, authorize(['pharmacy','admin','superadmin'])], addMedication);
router.put('/:medId', [authMiddleware, authorize(['admin','superadmin'])], updateMedication);
router.delete('/:medId', [authMiddleware, authorize([,'admin','superadmin'])], deleteMedication);


module.exports = router;