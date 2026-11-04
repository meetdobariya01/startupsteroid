// BackEnd/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authenticated (no token)' });
    }

    // ✅ FIX: signAccessToken signs with JWT_ACCESS_SECRET (see utils/generateTokens.js)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ✅ FIX: signAccessToken puts the user id in `sub`
    const userId = decoded.sub;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token payload' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    // Optional — matches authController.login's lock check
    if (typeof user.isLocked === 'function' && user.isLocked()) {
      return res
        .status(423)
        .json({ success: false, message: 'Account locked. Try again later.' });
    }

    req.user = user;
    next();
  } catch (err) {
    // jwt.verify throws on expired/malformed — normalize to 401 so the
    // frontend refresh interceptor can catch it and call /api/auth/refresh
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
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
};

module.exports = {
  authMiddleware,
  authorize,
  protect: authMiddleware,   // ✅ FIX: alias so `const { protect } = require(...)` works
};