
    const rateLimit = require("express-rate-limit");

    exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Try again later." },
    });

    exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    });