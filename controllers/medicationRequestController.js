// controllers/medicationRequestController.js
const MedicationRequest = require('../models/MedicationRequest');
const { validationResult } = require('express-validator');

// Add a Medication Request
exports.addMedicationRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { medicationName, urgency, medicalCondition, doctorPrescription, type } = req.body;

  try {
    const medicationRequest = await MedicationRequest.create({
      medicationName,
      urgency,
      medicalCondition,
      doctorPrescription,
      type,
      userId: req.user.id // Assuming the user is authenticated
    });

    res.status(201).json(medicationRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create medication request', details: error });
  }
};

// Get all Medication Requests
exports.getMedicationRequests = async (req, res) => {
  try {
    const medicationRequests = await MedicationRequest.findAll();
    res.status(200).json(medicationRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve medication requests', details: error });
  }
};

// Update a Medication Request
exports.updateMedicationRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const medicationRequest = await MedicationRequest.findByPk(id);

    if (!medicationRequest) {
      return res.status(404).json({ error: 'Medication request not found' });
    }

    if (medicationRequest.userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this request' });
    }

    await medicationRequest.update(req.body);
    res.json({ message: 'Medication request updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medication request', details: error });
  }
};

// Delete a Medication Request
exports.deleteMedicationRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const medicationRequest = await MedicationRequest.findByPk(id);

    if (!medicationRequest) {
      return res.status(404).json({ error: 'Medication request not found' });
    }

    if (medicationRequest.userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this request' });
    }

    await medicationRequest.destroy();
    res.json({ message: 'Medication request deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medication request', details: error });
  }
};
