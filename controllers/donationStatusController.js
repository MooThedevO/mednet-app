const { validationResult, body } = require('express-validator');
const DonationStatus = require('../models/DonationStatus');

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Validation rules for adding/updating donation statuses
const donationStatusValidationRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

// Get all donation statuses
exports.getAllDonations = async (req, res) => {
  try {
    const statuses = await DonationStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation statuses' });
  }
};

// Get donation status by ID
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

// Add a new donation status
exports.addStatus = [
  donationStatusValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    const { status, description } = req.body;

    try {
      const existingStatus = await DonationStatus.findOne({ where: { status } });
      if (existingStatus) {
        return res.status(400).json({ message: 'Status name already exists' });
      }

      const newStatus = await DonationStatus.create({ status, description });
      res.status(201).json(newStatus);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add donation status' });
    }
  }
];

// Update a donation status
exports.updateStatus = [
  donationStatusValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    try {
      const status = await DonationStatus.findByPk(req.params.statusId);
      if (!status) {
        return res.status(404).json({ error: 'Donation status not found' });
      }

      await status.update(req.body);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update donation status' });
    }
  }
];

// Delete a donation status
exports.deleteStatus = async (req, res) => {
  try {
    const status = await DonationStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Donation status not found' });
    }

    await status.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete donation status' });
  }
};