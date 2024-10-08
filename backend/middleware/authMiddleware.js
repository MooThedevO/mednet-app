const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Auth middleware to verify token and attach user to request
const authMiddleware =  async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token, authorization denied' });
      }
    
    try {
        const actualToken = token.split(' ')[1];
        console.log(actualToken);
        const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);
        const user =  await User.findByPk(decoded.id, { include: [Role] });
        if (!user || user.isDeleted) {
          return res.status(404).json({ message: 'User not found' });
      }

      req.user = {
        id: user.id,
        username: user.username,
        roleId: user.roleId,
        roleName: user.Role.name, // Include the role name dynamically from the Role model
    };

    next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again' });
    }
    return res.status(500).json({ message: 'Token is not valid', error: err.message });
}
};

// Role-based Authorization
const authorize = (roles) =>  async (req, res, next) => {
      try {
          const userRole =  await Role.findByPk(req.user.roleId);
          if (!roles.includes(userRole.name)) {
              return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
          }

          next();
      } catch (err) {
          res.status(500).json({ message: 'Server error', error: err.message });
      }
  };

// Self-authorization middleware to check if the user is performing actions on their own account
const authorizeSelf = () =>  (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const requestingUser = req.user;

      // Check if the requesting user is acting on their own account
      if (userId !== requestingUser.id && !['admin', 'superadmin'].includes(requestingUser.roleName)) {
        return res.status(403).json({ message: 'Not authorized to perform this action' });
    }
      next();
  };

module.exports = { authMiddleware, authorize, authorizeSelf };