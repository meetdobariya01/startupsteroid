const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    // password is optional (Google users don't have one)
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls for password-only users
      index: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    avatar: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    refreshTokenHash: { type: String, select: false },
    passwordChangedAt: Date,

    // ✅ NEW — true only after the registration/profile form is submitted
    isProfileComplete: {
      type: Boolean,
      default: false,
      index: true,
    },
    profileCompletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving — NO next() in Mongoose 8 async hook
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  const salt = await bcrypt.genSalt(rounds);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("User", userSchema);