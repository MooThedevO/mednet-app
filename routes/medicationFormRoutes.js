// routes/medicationRoutes.js
const express = require('express');
const { getAllForms, getFormById, addForm, updateForm, deleteForm } = require('../controllers/medicationFormController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllForms);
router.get('/:id', getFormById);

// Protected routes
router.post('/', [authMiddleware, authorize(['superadmin'])], addForm);
router.put('/:formId', [authMiddleware, authorize(['superadmin'])], updateForm);
router.delete('/:formId', [authMiddleware, authorize(['superadmin'])], deleteForm);


module.exports = router;