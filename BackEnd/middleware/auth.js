// BackEnd/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────
// authMiddleware — verifies JWT, attaches req.user
// NEVER throws (returns 401 instead)
// ─────────────────────────────────────────────
const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: 'Not authenticated (no token)' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch fresh user so role changes take effect immediately
        const user = await User.findById(decoded.id || decoded._id).select('-password');
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('❌ authMiddleware error:', err.message);
        return res
            .status(401)
            .json({ success: false, message: 'Invalid or expired token' });
    }
};

// ─────────────────────────────────────────────
// authorize — role-based access check
// NEVER throws
// ─────────────────────────────────────────────
const authorize = (...roles) => (req, res, next) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: 'Not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: requires role ${roles.join(' or ')}`,
            });
        }
        next();
    } catch (err) {
        console.error('❌ authorize error:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { authMiddleware, authorize };