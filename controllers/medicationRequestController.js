const MedicationRequest = require('../models/MedicationRequest');
const UrgencyLevel = require('../models/UrgencyLevel');
const Medication = require('../models/Medication');
const MedicalCondition = require('../models/MedicalCondition')
const RequestStatus = require('../models/RequestStatus');
const User = require('../models/User');

// Get all medication requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MedicationRequest.findAll({
      where: { isDeleted: false },
      include: [User, UrgencyLevel, Medication, MedicalCondition, RequestStatus]
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get a medication request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await MedicationRequest.findByPk(req.params.requestId, {
      include: [User, UrgencyLevel, Medication, MedicalCondition, RequestStatus]
    });
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Add a new medication request
exports.addRequest = async (req, res) => {
  try {
    const newRequest = await MedicationRequest.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add request' });
  }
};

// Update a medication request
exports.updateRequest = async (req, res) => {
  try {
    const request = await MedicationRequest.findByPk(req.params.requestId);
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await request.update(req.body);
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update request' });
  }
};

// Soft delete a medication request (soft delete = set isDeleted to true)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MedicationRequest.findByPk(req.params.requestId);
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.isDeleted = true;
    await request.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
};
