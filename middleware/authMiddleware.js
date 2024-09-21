const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (role = null) => (req, res, next) => {
  const token = req.header('Authorization');

  // Check if the token is present
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Extract the token part after "Bearer "
  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);  // Ensure SECRET_KEY is correct
        // Log the decoded token for debugging

    req.user = decoded; // Attach user info to the request

    if (role && req.user.role !== role) { //handle roles
      return res.status(403).json({ error: 'Access denied, insufficient permissions' });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports.isPharmacy = (req, res, next) => {
  if (req.user.role !== 'pharmacy') {
    return res.status(403).json({ error: 'Access denied. Only pharmacies can perform this action.' });
  }
  next();
};