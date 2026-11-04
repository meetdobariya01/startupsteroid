const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { validateSignup, validateLogin } = require("../middleware/validate");

router.post("/signup", authLimiter, validateSignup, ctrl.signup);
router.post("/login", authLimiter, validateLogin, ctrl.login);
router.post("/google", authLimiter, ctrl.googleLogin); // ← NEW
router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);
router.get("/me", protect, ctrl.me);

module.exports = router;