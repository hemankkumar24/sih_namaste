const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
    sendAbhaOtpSchema,
    verifyAbhaOtpSchema,
    verifyHprSchema,
    refreshTokenSchema,
} = require('../utils/validators');
const rateLimiter = require('../middleware/rateLimit');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/abha/send-otp', rateLimiter.auth, validate(sendAbhaOtpSchema), authController.sendAbhaOtp);
router.post('/abha/verify-otp', rateLimiter.auth, validate(verifyAbhaOtpSchema), authController.verifyAbhaOtp);
router.post('/hpr/verify', rateLimiter.auth, validate(verifyHprSchema), authController.verifyHpr);
router.post('/refresh', rateLimiter.auth, validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;