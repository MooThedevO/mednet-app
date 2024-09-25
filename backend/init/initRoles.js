const Role = require('../models/Role');

const initRoles = async () => {
  try {
    await Role.bulkCreate([
      { name: 'user', description: 'People requesting medication' },
      { name: 'pharmacy', description: 'Pharmacies selling medication' },
      { name: 'donor', description: 'People donating medication' },
      { name: 'admin', description: 'Administrator with higher privileges' },
      { name: 'superadmin', description: 'Super administrator with all privileges' },
    ], {
      ignoreDuplicates: true, // This will prevent recreating the roles if they already exist
    });
    console.log('Roles initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

module.exports = initRoles;
