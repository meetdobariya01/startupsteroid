const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );

const signRefreshToken = (user, jti) =>
  jwt.sign(
    { sub: user._id, jti },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );

// Hash refresh token before storing in DB (so DB leak ≠ token theft)
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

module.exports = { signAccessToken, signRefreshToken, hashToken };