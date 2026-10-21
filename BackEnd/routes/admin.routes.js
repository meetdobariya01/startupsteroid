// BackEnd/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth');
const User = require('../models/User');

const {
    reviewDocument,
    approveAll,
    rejectAll,
    listPending,
    getVerificationStats,
    listAllVerifications,
} = require('../controllers/verificationController');

// Every route below requires auth + admin role
router.use(authMiddleware, authorize('admin'));

// ─────────────────────────────────────────────
// DOCUMENT VERIFICATION — MUST come before /users/:id
// ─────────────────────────────────────────────
router.get('/verification/stats', getVerificationStats);
router.get('/verification/all', listAllVerifications);
router.get('/verification/pending', listPending);

router.patch('/verification/:userId/doc/:docKey', reviewDocument);

router.post('/verification/:userId/approve-all', (req, res, next) => {
    console.log('🔥 ROUTE /approve-all userId=', req.params.userId, 'admin=', req.user?._id);
    next();
}, approveAll);

router.post('/verification/:userId/reject-all', (req, res, next) => {
    console.log('🔥 ROUTE /reject-all userId=', req.params.userId, 'admin=', req.user?._id);
    next();
}, rejectAll);

// ─────────────────────────────────────────────
// ADMIN DASHBOARD — user list, roles, etc.
// ─────────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const admins = await User.countDocuments({ role: 'admin' });
        const verified = await User.countDocuments({ isVerified: true });
        const locked = await User.countDocuments({ lockUntil: { $gt: Date.now() } });

        res.json({ success: true, stats: { totalUsers, admins, verified, locked } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = req.query.search
            ? {
                  $or: [
                      { username: new RegExp(req.query.search, 'i') },
                      { email: new RegExp(req.query.search, 'i') },
                  ],
              }
            : {};

        const [users, total] = await Promise.all([
            User.find(filter).select('-password').skip(skip).limit(limit).sort('-createdAt'),
            User.countDocuments(filter),
        ]);

        res.json({
            success: true,
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.patch('/users/:id/verify', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        if (req.params.id === String(req.user._id)) {
            return res
                .status(400)
                .json({ success: false, message: "You can't delete yourself" });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;