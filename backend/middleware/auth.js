const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Example: "Bearer eyJ..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user ID to the request
    next(); // move to the actual route
  } catch (error) {
    console.error('Token error:', error);
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
