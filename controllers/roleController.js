const Role = require('../models/Role');
const { check, validationResult } = require('express-validator');

// Get all roles (public route)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve roles', error: err.message });
    }
};

// Get a single role by ID (public route)
exports.getRoleById = async (req, res) => {
    const roleId = parseInt(req.params.roleId, 10);

    if (isNaN(roleId)) return res.status(400).json({ message: 'Invalid Role ID' });

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.status(200).json(role);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve role', error: err.message });
    }
};

// Add a new role (restricted to superadmin)
exports.addRole = async (req, res) => {
    const { name, description } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // Ensure the role name is unique
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) return res.status(400).json({ message: 'Role name already exists' });

        const role = await Role.create({ name, description });
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create role', error: err.message });
    }
};

// Update an existing role (restricted to superadmin)
exports.updateRole = async (req, res) => {
    const roleId = parseInt(req.params.roleId, 10);

    if (isNaN(roleId)) return res.status(400).json({ message: 'Invalid Role ID' });

    const { name, description } = req.body;

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Ensure the role name is unique if updating name
        const existingRole = name && (await Role.findOne({ where: { name } }));

        if (existingRole && existingRole.id !== role.id) {
            return res.status(400).json({ message: 'Role name already exists' });
          }
      
        // Update the role fields explicitly
        role.name = name || role.name;
        role.description = description || role.description;

        await role.save();

        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
    }
};

// Delete a role (restricted to superadmin)
exports.deleteRole = async (req, res) => {
    const roleId = parseInt(req.params.roleId, 10);

    if (isNaN(roleId)) return res.status(400).json({ message: 'Invalid Role ID' });

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        await role.destroy();
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete role', error: err.message });
    }
};
