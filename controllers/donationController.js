// controllers/donationController.js
const Donation = require('../models/Donation');
const { validationResult } = require('express-validator');

// Add a Donation
exports.addDonation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { medicationId, amount, isMonetary, anonymous } = req.body;

  try {
    const donation = await Donation.create({
      medicationId,
      amount,
      isMonetary,
      anonymous,
      userId: req.user.id // Assuming the user is authenticated
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create donation', details: error });
  }
};

// Get all Donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve donations', details: error });
  }
};

// Update a Donation
exports.updateDonation = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findByPk(id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this donation' });
    }

    await donation.update(req.body);
    res.json({ message: 'Donation updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update donation', details: error });
  }
};

// Delete a Donation
exports.deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    const donation = await Donation.findByPk(id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.userId != req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this donation' });
    }

    await donation.destroy();
    res.json({ message: 'Donation deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete donation', details: error });
  }
};