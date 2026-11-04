const { body, validationResult } = require("express-validator");

exports.validateSignup = [
  body("firstName")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name is required"),
  body("lastName")
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name is required"),
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail()
    .isLength({ max: 254 }),
  body("password")
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be 8–128 chars")
    .matches(/[A-Z]/)
    .withMessage("Must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Must contain a lowercase letter")
    .matches(/\d/)
    .withMessage("Must contain a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must contain a special character"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });
    next();
  },
];

exports.validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 1, max: 128 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: "Invalid credentials" });
    next();
  },
];