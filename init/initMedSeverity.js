const MedSeverity = require('../models/MedSeverity');

const initMedSeverity = async () => {
  try {
    await MedSeverity.bulkCreate([
        { severity: 'Mild', description: 'Minor condition, no immediate attention required' },
        { severity: 'Moderate', description: 'Moderate condition, attention required' },
        { severity: 'Severe', description: 'Severe condition, immediate attention required' },
        { severity: 'Critical', description: 'Life-threatening condition, urgent medical intervention required' }
        ], {
      ignoreDuplicates: true, // This will prevent recreating the forms if they already exist
    });
    console.log('mid severity initialized successfully');
  } catch (error) {
    console.error('Error initializing mid severity:', error);
  }
};

module.exports = initMedSeverity;