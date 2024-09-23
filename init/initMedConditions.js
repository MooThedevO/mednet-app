const MedicalCondition = require('../models/MedicalCondition');
const MedSeverity = require('../models/MedSeverity');

const initMedConditions = async () => {
  try {
    // Find severity levels to associate them with conditions
    const mildSeverity = await MedSeverity.findOne({ where: { severity: 'Mild' } });
    const moderateSeverity = await MedSeverity.findOne({ where: { severity: 'Moderate' } });
    const severeSeverity = await MedSeverity.findOne({ where: { severity: 'Severe' } });

    if (!mildSeverity || !moderateSeverity || !severeSeverity) {
      console.error('Severity levels not properly initialized.');
      return;
    }

    // Insert medical conditions with associated severity levels
    await MedicalCondition.bulkCreate([
      {
        name: 'Hypertension',
        description: 'A condition with persistently elevated blood pressure.',
        severityId: moderateSeverity.id
      },
      {
        name: 'Diabetes',
        description: 'A metabolic disease that causes high blood sugar.',
        severityId: severeSeverity.id
      },
      {
        name: 'Common Cold',
        description: 'A mild viral infection of the upper respiratory tract.',
        severityId: mildSeverity.id
      },
      {
        name: 'Asthma',
        description: 'A chronic condition that affects the airways in the lungs.',
        severityId: moderateSeverity.id
      },
      {
        name: 'Heart Attack',
        description: 'A medical emergency when blood flow to the heart is blocked.',
        severityId: severeSeverity.id
      }
    ], {
      ignoreDuplicates: true, // This ensures no duplicates are added
    });

    console.log('Medical conditions initialized successfully');
  } catch (error) {
    console.error('Error initializing medical conditions:', error);
  }
};

module.exports = initMedConditions;
