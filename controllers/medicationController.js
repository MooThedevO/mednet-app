// controllers/medicationController.js
const Medication = require('../models/Medication');
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');

exports.addMedication = [
    // Validation rules
    check('name').notEmpty().withMessage('Name is required'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    check('price').isFloat({ min: 0 }).optional().withMessage('Price must be a positive number'),

    async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, quantity, condition, location, price, donation, expirationDate, brand, dosage, form, storage } = req.body;

  // Simple field validation
  if (!name || !quantity || !expirationDate || !condition || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  // Validate expiration date format (YYYY-MM-DD)
  const expirationRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!expirationRegex.test(expirationDate)) {
    return res.status(400).json({ error: 'Invalid expiration date format. Use YYYY-MM-DD' });
  }

  // Quantity should be a positive integer
  if (quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a positive integer' });
  }

  try {
    const medication = await Medication.create({
      name,
      description,
      quantity,
      condition,
      location,
      price,
      donation,
      expirationDate,
      brand,
      dosage,
      form,
      storage,
      userId: req.user.id, // Get the userId from the authenticated user
    });
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medication', details: error });
  }
}];

exports.getMedications = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const medications = await Medication.findAndCountAll({
      limit,
      offset,
    });
    res.status(200).json({
      totalItems: medications.count,
      totalPages: Math.ceil(medications.count / limit),
      currentPage: page,
      medications: medications.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve medications', details: error });
  }
};

exports.searchMedications = async (req, res) => {
  const { name, location, brand, condition } = req.query;

  try {
    const medications = await Medication.findAll({
      where: {
        ...(name && { name: { [Op.iLike]: `%${name}%` } }),
        ...(location && { location: { [Op.iLike]: `%${location}%` } }),
        ...(brand && { brand: { [Op.iLike]: `%${brand}%` } }),
        ...(condition && { condition }),
      },
    });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search medications', details: error });
  }
};

exports.updateMedication = async (req, res) => {
  const { id } = req.params;

  try {
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    if (medication.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this medication' });
    }

    await medication.update(req.body);
    res.json({ message: 'Medication updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medication', details: error });
  }
};

exports.deleteMedication = async (req, res) => {
  const { id } = req.params;

  try {
    const medication = await Medication.findByPk(id);

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    if (medication.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this medication' });
    }

    await medication.destroy();
    res.json({ message: 'Medication deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medication', details: error });
  }
};