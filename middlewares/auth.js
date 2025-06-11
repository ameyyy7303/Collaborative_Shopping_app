const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ error: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // You’ll have access to req.user.id now
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

module.exports = auth;
