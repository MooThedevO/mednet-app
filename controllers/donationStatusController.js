// controllers/requestStatusController.js
const DonationStatus = require('../models/DonationStatus');

// Get all request statuses
exports.getAllDonations = async (req, res) => {
  try {
    const statuses = await DonationStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Donation statuses' });
  }
};

// Get request status by ID
exports.getDonationById = async (req, res) => {
  try {
    const status = await DonationStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Donation status not found' });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation status' });
  }
};

// Add a new request status
exports.addStatus = async (req, res) => {
    const { status, description } = req.body;

    try {
    const existingstatus = await DonationStatus.findOne({ where: { status } });
    if (existingstatus) return res.status(400).json({ message: 'status name already exists' });

    const newStatus = await DonationStatus.create({ status, description });
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add donation status' });
  }
};

// Update a request status
exports.updateStatus = async (req, res) => {
  try {
    const status = await DonationStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Request status not found' });
    }
    await status.update(req.body);
    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update request status' });
  }
};

// Delete a request status
exports.deleteStatus = async (req, res) => {
  try {
    const status = await DonationStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Request status not found' });
    }
    await status.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request status' });
  }
};
