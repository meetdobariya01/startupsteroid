const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('mobile')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage('Password must contain at least one letter, one number, and one special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

// ✅ FIXED: Login validation - Accept username OR email (NO @ required)
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Username or email is required')
    .trim()
    .custom((value) => {
      // Only validate as email if it contains @
      if (value.includes('@')) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(value)) {
          throw new Error('Please provide a valid email');
        }
      }
      return true;
    }),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === 'string') {
      return value.replace(/[<>]/g, '');
    }
    return value;
  };

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitize(req.body[key]);
    });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validate,
  sanitizeInput
};