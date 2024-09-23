const Role = require('../models/Role');

// Get all roles (public route)
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single role by ID (public route)
exports.getRoleById = async (req, res) => {
    const { roleId } = req.params.roleId;

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        res.status(200).json(role);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add a new role (restricted to superadmin)
exports.addRole = async (req, res) => {
    const { name, description } = req.body;

    try {
        // Ensure the role name is unique
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) return res.status(400).json({ message: 'Role name already exists' });

        const role = await Role.create({ name, description });
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update an existing role (restricted to superadmin)
exports.updateRole = async (req, res) => {
    const { roleId } = req.params.roleId;
    const { name, description } = req.body;

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        // Ensure the role name is unique if updating name
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({ where: { name } });
            if (existingRole) return res.status(400).json({ message: 'Role name already exists' });
        }

        role.name = name || role.name;
        role.description = description || role.description;
        await role.save();

        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a role (restricted to superadmin)
exports.deleteRole = async (req, res) => {
    const { roleId } = req.params.roleId;

    try {
        const role = await Role.findByPk(roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        await role.destroy();
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
