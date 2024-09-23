const MedicalCondition = require('../models/MedicalCondition');
const MedSeverity = require('../models/MedSeverity');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Get all conditions
exports.getAllConditions = async (req, res) => {
    try {
        const conditions = await MedicalCondition.findAll({ include: [MedSeverity] });
        res.status(200).json(conditions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  // Get specific condition by ID
  exports.getMedCondition = async (req, res) => {
    const { conditionId } = req.params.conditionId;
  
    try {
      const condition = await MedicalCondition.findByPk(conditionId, { include: [MedSeverity] });
      if (!condition) return res.status(404).json({ error: 'Medical Condition not found' });
  
      res.status(200).json(condition);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user profile', details: error });
    }
  };

  // Add Condition
  exports.addMedCondition = async (req, res) => {
    const { name, description, severityName} = req.body;

    try {
        const existingCondition = await MedicalCondition.findOne({ where: { name } });
        if (existingCondition) return res.status(400).json({ message: 'Medical Condition already exists' });
    
        const severity = await MedSeverity.findOne({ where: { severity: severityName } });
        if (!severity) return res.status(400).json({ message: 'severity not found' });

        const condition = await MedicalCondition.create({
            name,
            description,
            severityId : severity.Id
        });

        res.status(201).json({ message: 'Condition added successfully!' });

    }catch(error){
        res.status(400).json({ error: 'Error adding condition', details: error });

    }
  };

  // Update Medical condition
exports.updateMedCondition = async (req, res) => {
    const { name, description, severityName} = req.body;

    try {
      const condition = await MedicalCondition.findByPk(req.params.conditionId);
      if (!condition) {
        return res.status(404).json({ error: 'Condition not found' });
      }
      const severity = await MedSeverity.findOne({ where: { severity: severityName } });
      if (!severity) return res.status(400).json({ message: 'severity not found' });

      condition.name = name || condition.name;
      condition.description = description || condition.description;
      condition.severityId = severity.id || condition.severityId

      await condition.save();
      res.status(200).json(condition);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update condition' });
    }
  };

  
// Delete medCondition
exports.deleteMedCondition = async (req, res) => {
    try {
      const condition = await MedicalCondition.findByPk(req.params.conditionId);
      if (!condition) {
        return res.status(404).json({ error: 'condition not found' });
      }
      await condition.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete condition' });
    }
  };
  
  