const MedicationForm = require('../models/MedicationForm');

// Get all medication forms
exports.getAllForms = async (req, res) => {
  try {
    const forms = await MedicationForm.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medication forms' });
  }
};

// Get a medication form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await MedicationForm.findByPk(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

// Add a new form
exports.addForm = async (req, res) => {
  try {
    const formName = req.body.name
    const existingform = await Medication.findOne({ where: { formName } });
    if (existingform) return res.status(400).json({ message: 'form name already exists' });

    const newForm = await MedicationForm.create(req.body);
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add form' });
  }
};

// Update a form
exports.updateForm = async (req, res) => {
  try {
    const form = await MedicationForm.findByPk(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    await form.update(req.body);
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update form' });
  }
};

// Delete a form
exports.deleteForm = async (req, res) => {
  try {
    const form = await MedicationForm.findByPk(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    await form.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
};
