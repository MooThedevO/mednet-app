// controllers/donationController.js
const Donation = require('../models/Donation');
const { validationResult } = require('express-validator');
const Medication = require('../models/Medication');
const User = require('../models/User');
const DonationStatus = require('../models/DonationStatus');

// Get all donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { isDeleted: false },
      include: [User, Medication, DonationStatus ]
    });
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// Get a donation  by ID
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId, {
      include: [User, Medication, DonationStatus ]
    });
    if (!donation || donation.isDeleted) {
      return res.status(404).json({ error: 'donation not found' });
    }
    res.status(200).json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation' });
  }
};

// Add a new donation
exports.addDonation = async (req, res) => {
  try {
    const newDonation = await Donation.create(req.body);
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add request' });
  }
};

// Update a donation
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId);
    if (!donation || donation.isDeleted) {
      return res.status(404).json({ error: 'donation not found' });
    }
    await donation.update(req.body);
    res.status(200).json(donation);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update donation' });
  }
};

// Soft delete a medication request (soft delete = set isDeleted to true)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByPk(req.params.donationId);
    if (!donation || donation.isDeleted) {
      return res.status(404).json({ error: 'donation not found' });
    }
    donation.isDeleted = true;
    await donation.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete donation' });
  }
};
