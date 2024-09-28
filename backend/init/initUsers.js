const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

const initUsers = async () => {
    try {
        const roles = await Role.findAll();
        const password = await bcrypt.hash('password123', 10);

        await User.bulkCreate([
            {
                username: 'user1',
                email: 'user1@example.com',
                password,
                fullName: 'User One',
                roleId: roles.find(role => role.name === 'user').id,
                isVerified: true // Set to true
            },
            {
                username: 'pharmacy1',
                email: 'pharmacy1@example.com',
                password,
                fullName: 'Pharmacy One',
                roleId: roles.find(role => role.name === 'pharmacy').id,
                isVerified: true // Set to true
            },
            {
                username: 'donor1',
                email: 'donor1@example.com',
                password,
                fullName: 'Donor One',
                roleId: roles.find(role => role.name === 'donor').id,
                isVerified: true // Set to true
            },
            {
                username: 'admin1',
                email: 'admin1@example.com',
                password,
                fullName: 'Admin One',
                roleId: roles.find(role => role.name === 'admin').id,
                isVerified: true // Set to true
            },
            {
                username: 'superadmin1',
                email: 'superadmin1@example.com',
                password,
                fullName: 'Super Admin One',
                roleId: roles.find(role => role.name === 'superadmin').id,
                isVerified: true // Set to true
            }
        ],{
            ignoreDuplicates: true,
        });

        console.log('Users initialized successfully.');
    } catch (err) {
        console.error('Error initializing users:', err.message);
    }
};

module.exports = initUsers;
