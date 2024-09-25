const { validationResult, body } = require('express-validator');
const MedicalCondition = require('../models/MedicalCondition');
const MedSeverity = require('../models/MedSeverity');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Validation rules for adding/updating conditions
const conditionValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('severityName')
    .notEmpty().withMessage('Severity is required')
    .isString().withMessage('Severity must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

// Get all conditions
exports.getAllConditions = async (req, res) => {
  try {
    const conditions = await MedicalCondition.findAll({ include: [MedSeverity] });
    res.status(200).json(conditions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific condition by ID
exports.getMedCondition = async (req, res) => {
  try {
    const condition = await MedicalCondition.findByPk(req.params.conditionId, { include: [MedSeverity] });
    if (!condition) return res.status(404).json({ error: 'Medical Condition not found' });

    res.status(200).json(condition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve medical condition', details: error });
  }
};

// Add Medical Condition
exports.addMedCondition = [
  conditionValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    const { name, description, severityName } = req.body;
    try {
      const existingCondition = await MedicalCondition.findOne({ where: { name } });
      if (existingCondition) return res.status(400).json({ message: 'Medical Condition already exists' });

      const severity = await MedSeverity.findOne({ where: { severity: severityName } });
      if (!severity) return res.status(400).json({ message: 'Severity not found' });

      const condition = await MedicalCondition.create({
        name,
        description,
        severityId: severity.id,
      });

      res.status(201).json({ message: 'Condition added successfully!', condition });
    } catch (error) {
      res.status(500).json({ error: 'Error adding condition', details: error });
    }
  }
];

// Update Medical Condition
exports.updateMedCondition = [
  conditionValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    const { name, description, severityName } = req.body;
    try {
      const condition = await MedicalCondition.findByPk(req.params.conditionId);
      if (!condition) {
        return res.status(404).json({ error: 'Condition not found' });
      }

      const severity = await MedSeverity.findOne({ where: { severity: severityName } });
      if (!severity) return res.status(400).json({ message: 'Severity not found' });

      condition.name = name || condition.name;
      condition.description = description || condition.description;
      condition.severityId = severity.id;

      await condition.save();
      res.status(200).json(condition);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update condition', details: error });
    }
  }
];

// Delete Medical Condition
exports.deleteMedCondition = async (req, res) => {
  try {
    const condition = await MedicalCondition.findByPk(req.params.conditionId);
    if (!condition) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    await condition.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete condition' });
  }
};