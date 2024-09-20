// controllers/medicationController.js
const Medication = require('../models/Medication');

exports.addMedication = async (req, res) => {
  const { name, description, quantity, condition, location, price, donation } = req.body;

  try {
    const medication = await Medication.create({
      name,
      description,
      quantity,
      condition,
      location,
      price,
      donation,
      userId: req.user.id, // Get the userId from the authenticated user
    });
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medication', details: error });
  }
};

exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.findAll();
    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve medications', details: error });
  }
};
