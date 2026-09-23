// BackEnd/controllers/verificationController.js
const User = require('../models/User');
const File = require('../models/File');

const {
    allVerifiedTemplate,
    allRejectedTemplate,
    singleRejectedTemplate,
} = require('../config/emailTemplates');

const {
    slugify,
    DESC_TO_KEY,
    KEY_TO_DESC,
    getSectionForFile,
} = require('../config/sectionMap');
const sendEmail = require('../config/sendEmail');
const { ALL_DOCUMENTS } = require('../config/documentSections');

// ─────────────────────────────────────────────
// Startup sanity check
// ─────────────────────────────────────────────
(function sanityCheck() {
    console.log('🔎 [verification] ALL_DOCUMENTS:', ALL_DOCUMENTS.length);
    console.log('🔎 [verification] DESC_TO_KEY:', Object.keys(DESC_TO_KEY).length);

    const missing = ALL_DOCUMENTS.filter((d) => !DESC_TO_KEY[d]);
    const extra = Object.keys(DESC_TO_KEY).filter((k) => !ALL_DOCUMENTS.includes(k));

    if (missing.length) {
        console.error('❌ [verification] MISSING keys for:');
        missing.forEach((d) => console.error('   -', JSON.stringify(d)));
    }
    if (extra.length) {
        console.error('❌ [verification] EXTRA keys (not in ALL_DOCUMENTS):');
        extra.forEach((k) => console.error('   -', JSON.stringify(k)));
    }
    if (!missing.length && !extra.length) {
        console.log('✅ [verification] DESC_TO_KEY matches ALL_DOCUMENTS perfectly.');
    }
})();

// ─────────────────────────────────────────────
// Serialize Mongoose Map → plain object
// ─────────────────────────────────────────────
const serializeVerification = (v) => {
    if (!v) return { documents: {}, overallStatus: 'pending' };
    const documents = {};
    if (v.documents instanceof Map) {
        v.documents.forEach((value, key) => {
            documents[key] = value;
        });
    } else if (v.documents && typeof v.documents === 'object') {
        Object.assign(documents, v.documents);
    }
    return {
        documents,
        overallStatus: v.overallStatus || 'pending',
        lastReviewedAt: v.lastReviewedAt,
    };
};

// ─────────────────────────────────────────────
// Fire-and-forget email — CANNOT crash the request
// Runs on the next tick, outside the request call stack
// ─────────────────────────────────────────────
const safeSendEmail = (to, templateFn, ...args) => {
    setImmediate(() => {
        try {
            const tpl = templateFn(...args);
            if (!tpl || !tpl.subject) {
                console.error('❌ Email template invalid');
                return;
            }
            sendEmail({ to, ...tpl })
                .then((r) => {
                    if (r?.success) console.log('✅ Email sent:', to, '-', tpl.subject);
                    else console.error('❌ Email failed:', r?.error);
                })
                .catch((e) => console.error('❌ Email threw:', e.message));
        } catch (e) {
            console.error('❌ Email template threw:', e.message);
        }
    });
};

// ─────────────────────────────────────────────
// Recompute overall status
// ─────────────────────────────────────────────
const computeOverallStatus = (documents) => {
    const missing = [];
    const statuses = ALL_DOCUMENTS.map((desc) => {
        const k = DESC_TO_KEY[desc];
        if (!k) {
            missing.push(desc);
            return 'pending';
        }
        const entry = documents.get(k);
        return entry?.status || 'pending';
    });

    if (missing.length) console.error('❌ DESC_TO_KEY missing entries:', missing);

    const verifiedCount = statuses.filter((s) => s === 'verified').length;
    const rejectedCount = statuses.filter((s) => s === 'rejected').length;

    let overallStatus = 'pending';
    if (verifiedCount === ALL_DOCUMENTS.length) overallStatus = 'verified';
    else if (rejectedCount > 0) overallStatus = 'rejected';

    return { overallStatus, statuses, verifiedCount, rejectedCount, missing };
};

// ─────────────────────────────────────────────
// PATCH /api/admin/verification/:userId/doc/:docKey
// ─────────────────────────────────────────────
const reviewDocument = async (req, res) => {
    try {
        const { userId, docKey } = req.params;
        const { status, reason } = req.body;

        console.log('🔥 reviewDocument CALLED', { userId, docKey, status });

        const description = KEY_TO_DESC[docKey];
        if (!description) {
            return res
                .status(400)
                .json({ success: false, message: `Invalid document key: ${docKey}` });
        }
        if (!['verified', 'rejected'].includes(status)) {
            return res
                .status(400)
                .json({ success: false, message: 'Status must be verified or rejected' });
        }
        if (status === 'rejected' && !reason?.trim()) {
            return res
                .status(400)
                .json({ success: false, message: 'Rejection reason is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.verification) user.verification = {};
        if (!(user.verification.documents instanceof Map)) {
            user.verification.documents = new Map();
        }

        const wasFullyVerified = user.verification.overallStatus === 'verified';

        user.verification.documents.set(docKey, {
            status,
            reason: status === 'rejected' ? reason.trim() : '',
            reviewedAt: new Date(),
            reviewedBy: req.user?._id || req.user?.id || null,
        });
        user.verification.lastReviewedAt = new Date();

        const { overallStatus, statuses } = computeOverallStatus(user.verification.documents);
        user.verification.overallStatus = overallStatus;

        await user.save();

        if (status === 'rejected') {
            safeSendEmail(user.email, singleRejectedTemplate, user, docKey, reason);

            const allRejected =
                statuses.length > 0 && statuses.every((s) => s === 'rejected');
            if (overallStatus === 'rejected' && allRejected) {
                safeSendEmail(user.email, allRejectedTemplate, user, reason);
            }
        } else if (status === 'verified' && overallStatus === 'verified' && !wasFullyVerified) {
            safeSendEmail(user.email, allVerifiedTemplate, user);
        }

        return res.json({
            success: true,
            message: `"${description}" marked as ${status}`,
            verification: serializeVerification(user.verification),
        });
    } catch (err) {
        console.error('❌ reviewDocument error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────
// POST /api/admin/verification/:userId/approve-all
// ─────────────────────────────────────────────
const approveAll = async (req, res) => {
    console.log('🔥 approveAll CALLED userId=', req.params.userId, 'admin=', req.user?._id);
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.verification) user.verification = {};
        if (!(user.verification.documents instanceof Map)) {
            user.verification.documents = new Map();
        }

        const now = new Date();
        const reviewerId = req.user?._id || req.user?.id || null;
        let skipped = 0;

        ALL_DOCUMENTS.forEach((desc) => {
            const key = DESC_TO_KEY[desc];
            if (!key) {
                console.error('❌ approveAll: no key for desc:', desc);
                skipped++;
                return;
            }
            user.verification.documents.set(key, {
                status: 'verified',
                reason: '',
                reviewedAt: now,
                reviewedBy: reviewerId,
            });
        });

        user.verification.overallStatus = 'verified';
        user.verification.lastReviewedAt = now;

        await user.save();
        console.log('✅ approveAll saved for', user.email);

        safeSendEmail(user.email, allVerifiedTemplate, user);

        res.json({
            success: true,
            message: skipped
                ? `All documents verified (${skipped} skipped)`
                : 'All documents verified',
            verification: serializeVerification(user.verification),
        });
    } catch (err) {
        console.error('❌ approveAll error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────
// POST /api/admin/verification/:userId/reject-all
// ─────────────────────────────────────────────
const rejectAll = async (req, res) => {
    console.log('🔥 rejectAll CALLED userId=', req.params.userId, 'admin=', req.user?._id);
    try {
        const { reason } = req.body;
        if (!reason?.trim()) {
            return res
                .status(400)
                .json({ success: false, message: 'Rejection reason is required' });
        }

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (!user.verification) user.verification = {};
        if (!(user.verification.documents instanceof Map)) {
            user.verification.documents = new Map();
        }

        const now = new Date();
        const reviewerId = req.user?._id || req.user?.id || null;
        let skipped = 0;

        ALL_DOCUMENTS.forEach((desc) => {
            const key = DESC_TO_KEY[desc];
            if (!key) {
                console.error('❌ rejectAll: no key for desc:', desc);
                skipped++;
                return;
            }
            user.verification.documents.set(key, {
                status: 'rejected',
                reason: reason.trim(),
                reviewedAt: now,
                reviewedBy: reviewerId,
            });
        });

        user.verification.overallStatus = 'rejected';
        user.verification.lastReviewedAt = now;

        await user.save();

        safeSendEmail(user.email, allRejectedTemplate, user, reason);

        res.json({
            success: true,
            message: skipped
                ? `All documents rejected (${skipped} skipped)`
                : 'All documents rejected',
            verification: serializeVerification(user.verification),
        });
    } catch (err) {
        console.error('❌ rejectAll error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/admin/verification/pending
// ─────────────────────────────────────────────
const listPending = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const userIdsWithFiles = await File.distinct('userId', { isDeleted: false });

        const filter = {
            _id: { $in: userIdsWithFiles },
            role: { $ne: 'admin' },
            'verification.overallStatus': { $in: ['pending', 'rejected'] },
        };

        const [users, total] = await Promise.all([
            User.find(filter).select('-password').skip(skip).limit(limit).sort('-updatedAt'),
            User.countDocuments(filter),
        ]);

        const enriched = await Promise.all(
            users.map(async (u) => {
                const files = await File.find({ userId: u._id, isDeleted: false })
                    .select('originalName description folder mimeType fileSize createdAt _id')
                    .sort('-createdAt');

                const filesByKey = {};
                files.forEach((f) => {
                    const key = getSectionForFile(f);
                    if (!key) return;
                    if (!filesByKey[key]) filesByKey[key] = [];
                    filesByKey[key].push(f);
                });

                return {
                    ...u.toObject(),
                    verification: serializeVerification(u.verification),
                    files,
                    filesByKey,
                };
            })
        );

        res.json({
            success: true,
            users: enriched,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('❌ listPending error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/admin/verification/stats
// ─────────────────────────────────────────────
const getVerificationStats = async (req, res) => {
    try {
        const userIdsWithFiles = await File.distinct('userId', { isDeleted: false });

        const baseFilter = {
            _id: { $in: userIdsWithFiles },
            role: { $ne: 'admin' },
        };

        const [total, pending, verified, rejected] = await Promise.all([
            User.countDocuments(baseFilter),
            User.countDocuments({ ...baseFilter, 'verification.overallStatus': 'pending' }),
            User.countDocuments({ ...baseFilter, 'verification.overallStatus': 'verified' }),
            User.countDocuments({ ...baseFilter, 'verification.overallStatus': 'rejected' }),
        ]);

        res.json({ success: true, stats: { total, pending, verified, rejected } });
    } catch (err) {
        console.error('❌ getVerificationStats error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/admin/verification/all
// ─────────────────────────────────────────────
const listAllVerifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { status = 'all', search = '' } = req.query;

        const userIdsWithFiles = await File.distinct('userId', { isDeleted: false });

        const filter = {
            _id: { $in: userIdsWithFiles },
            role: { $ne: 'admin' },
        };

        if (status !== 'all') filter['verification.overallStatus'] = status;

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(filter).select('-password').skip(skip).limit(limit).sort('-updatedAt'),
            User.countDocuments(filter),
        ]);

        const enriched = await Promise.all(
            users.map(async (u) => {
                const files = await File.find({ userId: u._id, isDeleted: false })
                    .select('originalName description folder mimeType fileSize createdAt _id')
                    .sort('-createdAt');

                const filesByKey = {};
                files.forEach((f) => {
                    const key = getSectionForFile(f);
                    if (!key) return;
                    if (!filesByKey[key]) filesByKey[key] = [];
                    filesByKey[key].push(f);
                });

                const submittedAt = files.length ? files[files.length - 1].createdAt : null;

                return {
                    ...u.toObject(),
                    verification: serializeVerification(u.verification),
                    files,
                    filesByKey,
                    submittedAt,
                };
            })
        );

        res.json({
            success: true,
            users: enriched,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('❌ listAllVerifications error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    reviewDocument,
    approveAll,
    rejectAll,
    listPending,
    getVerificationStats,
    listAllVerifications,
};