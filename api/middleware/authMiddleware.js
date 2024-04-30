// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decodedToken.userId;
        next();
    });
};

module.exports = { requireAuth };
