const { validationResult, body } = require('express-validator');
const MedicationForm = require('../models/MedicationForm');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Validation rules for adding/updating forms
const formValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

// Get all medication forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await MedicationForm.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medication forms' });
  }
};

// Get a medication form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await MedicationForm.findByPk(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// Add a new medication form
exports.addForm = [
  formValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    try {
      const { name } = req.body;
      const existingForm = await MedicationForm.findOne({ where: { name } });
      if (existingForm) {
        return res.status(400).json({ message: 'Form name already exists' });
      }

      const newForm = await MedicationForm.create(req.body);
      res.status(201).json(newForm);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add form' });
    }
  }
];

// Update a medication form
exports.updateForm = [
  formValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    try {
      const form = await MedicationForm.findByPk(req.params.formId);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }

      await form.update(req.body);
      res.status(200).json(form);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update form' });
    }
  }
];

// Delete a medication form
exports.deleteForm = async (req, res) => {
  try {
    const form = await MedicationForm.findByPk(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    await form.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};
