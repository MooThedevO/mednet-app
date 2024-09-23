const { validationResult, body } = require('express-validator');
const MedSeverity = require('../models/MedSeverity');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Validation rules for adding/updating severity levels
const severityValidationRules = [
  body('severity')
    .notEmpty().withMessage('Severity is required')
    .isString().withMessage('Severity must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

// Get all severity levels
exports.getAllSeverityLevels = async (req, res) => {
  try {
    const levels = await MedSeverity.findAll();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch severity levels' });
  }
};

// Get severity level by ID
exports.getSeverityLevelById = async (req, res) => {
  try {
    const level = await MedSeverity.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'Severity level not found' });
    }
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch severity level' });
  }
};

// Add a new severity level
exports.addSeverityLevel = [
  severityValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    const { severity, description } = req.body;

    try {
      const existingLevel = await MedSeverity.findOne({ where: { severity } });
      if (existingLevel) {
        return res.status(400).json({ message: 'Severity level already exists' });
      }

      const newLevel = await MedSeverity.create({ severity, description });
      res.status(201).json(newLevel);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add severity level' });
    }
  }
];

// Update a severity level
exports.updateSeverityLevel = [
  severityValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    try {
      const level = await MedSeverity.findByPk(req.params.levelId);
      if (!level) {
        return res.status(404).json({ error: 'Severity level not found' });
      }

      await level.update(req.body);
      res.status(200).json(level);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update severity level' });
    }
  }
];

// Delete a severity level
exports.deleteSeverityLevel = async (req, res) => {
  try {
    const level = await MedSeverity.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'Severity level not found' });
    }

    await level.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete severity level' });
  }
};