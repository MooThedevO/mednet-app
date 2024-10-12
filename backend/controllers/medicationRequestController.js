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
    res.status(500).json({ error: 'Failed to fetch medication requests', details: error.message });
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
    res.status(500).json({ error: 'Failed to fetch medication request', details: error.message });
  }
};

// Add a new medication request
exports.addRequest = async (req, res) => {
  const { userId, medicationId, quantity, urgencyId, conditionId, doctorPrescription, isDonation, statusId } = req.body;
  if (!userId || !medicationId || !quantity || !urgencyId || !conditionId || !statusId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newRequest = await MedicationRequest.create(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add medication request', details: error.message });
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
    res.status(400).json({ error: 'Failed to update medication request', details: error.message });
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
    res.status(500).json({ error: 'Failed to delete medication request', details: error.message });
  }
};

// Mark a medication request as fulfilled
exports.fulfillRequest = async (req, res) => {
  try {
    const request = await MedicationRequest.findByPk(req.params.requestId);
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const underReviewStatus = await RequestStatus.findOne({ where: { status: 'Under Review' } });
    if (!underReviewStatus) {
      return res.status(404).json({ error: 'Review status not found' });
    }

    // Check if the request is still pending, not fulfilled already
    if (request.statusId !== underReviewStatus.id) {
      return res.status(400).json({ error: 'Request is not ready for fulfillment' });
    }

    const fulfilledStatus = await RequestStatus.findOne({ where: { status: 'Fulfilled' } });
    request.statusId = fulfilledStatus.id;
    await request.save();

    res.status(200).json({ message: 'Request marked as fulfilled', request });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to mark request as fulfilled',
      details: error.message,
    });
  }
};

exports.approveForDelivery = async (req, res) => {
  try {
    const request = await MedicationRequest.findByPk(req.params.requestId);
    if (!request || request.isDeleted) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const awaitingDeliveryStatus = await RequestStatus.findOne({ where: { status: 'Awaiting Delivery' } });
    if (!awaitingDeliveryStatus) {
      return res.status(404).json({ error: 'Awaiting delivery status not found' });
    }

    request.statusId = awaitingDeliveryStatus.id;
    await request.save();

    res.status(200).json({ message: 'Request approved for delivery', request });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to approve request for delivery',
      details: error.message,
    });
  }
};
