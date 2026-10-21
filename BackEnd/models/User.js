// BackEnd/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
            match: [
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores',
            ],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
        passwordChangedAt: {
            type: Date,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },

        // ─────────────────────────────────────────────
        // ✅ Document verification (NEW)
        // ─────────────────────────────────────────────
        verification: {
            documents: {
                type: Map,
                of: new mongoose.Schema(
                    {
                        status: {
                            type: String,
                            enum: ['pending', 'verified', 'rejected'],
                            default: 'pending',
                        },
                        reason: { type: String, default: '' },
                        reviewedAt: Date,
                        reviewedBy: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User',
                            default: null,
                        },
                    },
                    { _id: false }
                ),
                default: () => new Map(),
            },
            overallStatus: {
                type: String,
                enum: ['pending', 'verified', 'rejected'],
                default: 'pending',
            },
            lastReviewedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

// ✅ Guarded pre('save') — skip if not modified or already hashed
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    if (/^\$2[aby]\$\d{2}\$/.test(this.password)) return;

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.incrementLoginAttempts = async function () {
    const update = {};

    if (this.lockUntil && this.lockUntil < Date.now()) {
        update.$set = { loginAttempts: 1 };
        update.$unset = { lockUntil: 1 };
    } else {
        const next = (this.loginAttempts || 0) + 1;
        update.$set = { loginAttempts: next };
        if (next >= 5) {
            update.$set.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        }
    }

    await this.constructor.updateOne({ _id: this._id }, update);
};

userSchema.statics.isAccountLocked = function (lockUntil) {
    return lockUntil && lockUntil > Date.now();
};

module.exports = mongoose.model('User', userSchema);