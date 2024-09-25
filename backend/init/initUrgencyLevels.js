const UrgencyLevel = require('../models/UrgencyLevel');

const initUrgencyLevels = async () => {
  try {
    await UrgencyLevel.bulkCreate([
        { level: 'Low', description: 'Can wait for a longer period' },
        { level: 'Medium', description: 'Needs attention but not critical' },
        { level: 'High', description: 'Requires immediate action' }
    ], {
      ignoreDuplicates: true, // This will prevent recreating the roles if they already exist
    });
    console.log('Urgency levels initialized successfully');
  } catch (error) {
    console.error('Error initializing Urgency levels:', error);
  }
};

module.exports = initUrgencyLevels;
