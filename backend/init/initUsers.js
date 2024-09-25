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
                roleId: roles.find(role => role.name === 'user').id
            },
            {
                username: 'pharmacy1',
                email: 'pharmacy1@example.com',
                password,
                fullName: 'Pharmacy One',
                roleId: roles.find(role => role.name === 'pharmacy').id
            },
            {
                username: 'donor1',
                email: 'donor1@example.com',
                password,
                fullName: 'Donor One',
                roleId: roles.find(role => role.name === 'donor').id
            },
            {
                username: 'admin1',
                email: 'admin1@example.com',
                password,
                fullName: 'Admin One',
                roleId: roles.find(role => role.name === 'admin').id
            },
            {
                username: 'superadmin1',
                email: 'superadmin1@example.com',
                password,
                fullName: 'Super Admin One',
                roleId: roles.find(role => role.name === 'superadmin').id
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
