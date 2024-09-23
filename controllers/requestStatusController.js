const { validationResult, body } = require('express-validator');
const RequestStatus = require('../models/RequestStatus');

// Get all request statuses
exports.getAllStatuses = async (req, res) => {
  try {
    const statuses = await RequestStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request statuses' });
  }
};

// Get request status by ID
exports.getStatusById = async (req, res) => {
  try {
    const status = await RequestStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Request status not found' });
    }
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch request status' });
  }
};

// Add a new request status
exports.addStatus = [
  requestStatusValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    const { status, description } = req.body;

    try {
    const existingstatus = await RequestStatus.findOne({ where: { status } });
    if (existingstatus) return res.status(400).json({ message: 'status name already exists' });

    const newStatus = await RequestStatus.create({ status, description });
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add request status' });
  }
}
];

// Update a request status
exports.updateStatus = [
  requestStatusValidationRules,
  async (req, res) => {
    handleValidationErrors(req, res);

    try {
    const status = await RequestStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Request status not found' });
    }
    await status.update(req.body);
    res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update request status' });
  }
}
];

// Delete a request status
exports.deleteStatus = async (req, res) => {
  try {
    const status = await RequestStatus.findByPk(req.params.statusId);
    if (!status) {
      return res.status(404).json({ error: 'Request status not found' });
    }
    await status.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request status' });
  }
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Validation rules for adding/updating request statuses
const requestStatusValidationRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];
