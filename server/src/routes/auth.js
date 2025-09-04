const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
    sendAbhaOtpSchema,
    verifyAbhaOtpSchema,
    hprRegisterSchema, // <-- ADDED
    hprLoginSchema,    // <-- ADDED
    refreshTokenSchema,
} = require('../utils/validator');
const rateLimiter = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/abha/send-otp', rateLimiter.auth, validate(sendAbhaOtpSchema), authController.sendAbhaOtp);
router.post('/abha/verify-otp', rateLimiter.auth, validate(verifyAbhaOtpSchema), authController.verifyAbhaOtp);

// --- MODIFIED: Doctor routes now separated for register and login ---
router.post('/hpr/register', rateLimiter.auth, validate(hprRegisterSchema), authController.hprRegister);
router.post('/hpr/login', rateLimiter.auth, validate(hprLoginSchema), authController.hprLogin);

router.post('/refresh', rateLimiter.auth, validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;