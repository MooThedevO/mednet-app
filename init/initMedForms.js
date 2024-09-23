const MedicationForm = require('../models/MedicationForm');

const initMedForms = async () => {
  try {
    await MedicationForm.bulkCreate([
      { name: 'tablet', description: 'Solid dosage form' },
      { name: 'liquid', description: 'Liquid form for oral use' },
      { name: 'injection', description: 'Injection form for intravenous or intramuscular use' },
      { name: 'capsule', description: 'Gelatin-based capsule' },  
    ], {
      ignoreDuplicates: true, // This will prevent recreating the forms if they already exist
    });
    console.log('medication forms initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

module.exports = initMedForms;