const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const {
  signAccessToken,
  signRefreshToken,
  hashToken,
} = require("../utils/generateTokens");
const { encrypt, decrypt } = require("../utils/encryption");

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Cookie options ───
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // ✅ FIXED: Changed from "strict" to "lax"
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

// ─── Helpers ───
function safeDecrypt(value) {
  if (!value) return "";
  try {
    return decrypt(value);
  } catch {
    return "";
  }
}

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    firstName: safeDecrypt(user.firstName),
    lastName: safeDecrypt(user.lastName),
    role: user.role,
    avatar: user.avatar || null,
    authProvider: user.authProvider,
    isProfileComplete: !!user.isProfileComplete,
  };
}

// ─── SIGNUP ───
exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({
      firstName: encrypt(firstName.trim()),
      lastName: encrypt(lastName.trim()),
      email,
      password,
      authProvider: "local",
      isProfileComplete: false, 
    });

    const accessToken = signAccessToken(user);
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken(user, jti);

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(201).json({ accessToken, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// ─── LOGIN ───
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshTokenHash");

    if (!user) {
      await new Promise((r) => setTimeout(r, 300));
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).json({
        message: "This account was created with Google. Please sign in with Google.",
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({ message: "Account locked. Try again later." });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.failedLoginAttempts = 0;
      }
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const accessToken = signAccessToken(user);
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken(user, jti);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.json({ accessToken, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// ─── GOOGLE LOGIN ───
exports.googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, picture, email_verified } = payload;

    if (!email || !email_verified) {
      return res.status(400).json({ message: "Google account email is not verified" });
    }

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    }).select("+refreshTokenHash");

    if (!user) {
      user = await User.create({
        firstName: encrypt((given_name || "User").trim()),
        lastName: encrypt((family_name || "Account").trim()),
        email: email.toLowerCase(),
        googleId,
        authProvider: "google",
        avatar: picture || "",
        isProfileComplete: false, 
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar && picture) user.avatar = picture;
      }
      if (user.authProvider !== "google" && !user.password) {
        user.authProvider = "google";
      }
      if (user.isLocked()) {
        return res.status(423).json({ message: "Account locked. Try again later." });
      }
      await user.save({ validateBeforeSave: false });
    }

    const accessToken = signAccessToken(user);
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken(user, jti);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.json({ accessToken, user: publicUser(user) });
  } catch (err) {
    console.error("❌ Google login error:", err.message);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};

// ─── REFRESH ───
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.sub).select("+refreshTokenHash");
    if (!user) return res.status(401).json({ message: "Invalid session" });

    if (user.refreshTokenHash !== hashToken(token))
      return res.status(401).json({ message: "Token reuse detected" });

    const newJti = crypto.randomUUID();
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user, newJti);
    user.refreshTokenHash = hashToken(newRefresh);
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefresh, refreshCookieOptions);
    res.json({ accessToken: newAccess, user: publicUser(user) });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ─── LOGOUT ───
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        ignoreExpiration: true,
      });
      await User.findByIdAndUpdate(decoded.sub, { refreshTokenHash: null });
    }
  } catch (_) {}
  
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ message: "Logged out" });
};

// ─── CURRENT USER ───
exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};