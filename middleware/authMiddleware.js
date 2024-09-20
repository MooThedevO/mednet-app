const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  // Check if the token is present
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Extract the token part after "Bearer "
  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.SECRET_KEY);  // Ensure SECRET_KEY is correct
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};