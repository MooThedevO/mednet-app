const MedSeverity = require('../models/MedSeverity');
const UrgencyLevel = require('../models/MedSeverity');

// Get all urgency levels
exports.getAllSeverityLevels = async (req, res) => {
  try {
    const levels = await MedSeverity.findAll();
    res.status(200).json(levels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch severity levels' });
  }
};

// Get urgency level by ID
exports.getSeverityLevelById = async (req, res) => {
  try {
    const level = await MedSeverity.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'severity level not found' });
    }
    res.status(200).json(level);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch severity level' });
  }
};

// Add new urgency level
exports.addSeverityLevel = async (req, res) => {
    const { severity, description } = req.body;

  try {
    const existingLevel = await UrgencyLevel.findOne({ where: { severity } });
    if (existingLevel) return res.status(400).json({ message: 'severity leve already exists' });

    const newLevel = await UrgencyLevel.create({ severity, description });

    res.status(201).json(newLevel);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add severity level' });
  }
};

// Update urgency level
exports.updateSeverityLevel = async (req, res) => {
  try {
    const level = await UrgencyLevel.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'severity level not found' });
    }
    await level.update(req.body);
    res.status(200).json(level);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update severity level' });
  }
};

// Delete urgency level
exports.deleteSeverityLevel = async (req, res) => {
  try {
    const level = await UrgencyLevel.findByPk(req.params.levelId);
    if (!level) {
      return res.status(404).json({ error: 'Severity level not found' });
    }
    await level.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Severity level' });
  }
};
