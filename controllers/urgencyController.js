const UrgencyLevel = require('../models/UrgencyLevel');
const { validationResult } = require('express-validator');

// Get all urgency levels
exports.getAllUrgencyLevels = async (req, res) => {
  try {
    const levels = await UrgencyLevel.findAll();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch urgency levels' });
  }
};

// Get urgency level by ID
exports.getUrgencyLevelById = async (req, res) => {
  try {
    const level = await UrgencyLevel.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'Urgency level not found' });
    }
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch urgency level' });
  }
};

// Add new urgency level
exports.addUrgencyLevel = [
  urgencyValidationRules,
  async (req, res) => {

    handleValidationErrors(req, res);

    const { level, description } = req.body;

  try {
    const existingLevel = await UrgencyLevel.findOne({ where: { level } });
    if (existingLevel) return res.status(400).json({ message: 'urgency leve already exists' });

    const newLevel = await UrgencyLevel.create({ level, description });

      res.status(201).json(newLevel);
    } catch (error) {
      res.status(400).json({ error: 'Failed to add urgency level' });
    }
  }
];

// Update urgency level
exports.updateUrgencyLevel = [
  urgencyValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

  try {
      const level = await UrgencyLevel.findByPk(req.params.levelId);
      if (!level) {
        return res.status(404).json({ error: 'Urgency level not found' });
      }
      await level.update(req.body);
      res.status(200).json(level);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update urgency level' });
    }
  }
];

// Delete urgency level
exports.deleteUrgencyLevel = async (req, res) => {
  try {
    const level = await UrgencyLevel.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'Urgency level not found' });
    }
    await level.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete urgency level' });
  }
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

const urgencyValidationRules = [
  body('level')
    .notEmpty().withMessage('Level is required')
    .isString().withMessage('Level must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];
