const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  changePassword,
  updateProfile,
  logout
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const {
  validateSignup,
  validateLogin,
  validate,
  sanitizeInput
} = require('../middleware/validation');

// Public routes
router.post('/signup', sanitizeInput, validateSignup, validate, signup);
router.post('/login', sanitizeInput, validateLogin, validate, login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, changePassword);
router.put('/update-profile', authMiddleware, sanitizeInput, updateProfile);
router.post('/logout', authMiddleware, logout);

module.exports = router;