const Medication = require('../models/Medication');
const MedicationForm = require('../models/MedicationForm');

// Get all medications
exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.findAll({ include: [MedicationForm] });

    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
};

// Get medication by ID
exports.getMedicationById = async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.id, { include: [MedicationForm] });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.status(200).json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medication' });
  }
};

// Add a new medication
exports.addMedication = async (req, res) => {
  try {
    const medName = req.body.name
    const existingmed = await Medication.findOne({ where: { medName } });
    if (existingmed) return res.status(400).json({ message: 'Medication name already exists' });

    const newMedication = await Medication.create(req.body);
    res.status(201).json(newMedication);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add medication' });
  }
};

// Update a medication
exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.medId);
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    await medication.update(req.body);
    res.status(200).json(medication);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update medication' });
  }
};

// Delete a medication
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByPk(req.params.medId);
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    await medication.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medication' });
  }
};
