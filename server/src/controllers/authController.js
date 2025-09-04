const abhaService = require('../services/abhaService');
const hprService = require('../services/hprService');
const prisma = require('../lib/db');
const jwtUtils = require('../utils/jwt');
const hashUtils = require('../utils/hash');
const logger = require('../lib/logger');

const sendAbhaOtp = async (req, res, next) => {
    const { abhaNumber } = req.body;
    try {
        const { txId } = await abhaService.sendOtp(abhaNumber);
        res.status(200).json({ txId });
    } catch (error) {
        logger.error(error, `Failed to send OTP to ABHA number: ${abhaNumber}`);
        next(error);
    }
};

const verifyAbhaOtp = async (req, res, next) => {
    const { txId, otp } = req.body;
    try {
        const patientData = await abhaService.verifyOtp(txId, otp);

        let user = await prisma.user.findFirst({
            where: { patientProfile: { abhaNumber: patientData.abhaNumber } },
            include: { patientProfile: true },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: patientData.name,
                    role: 'PATIENT',
                    patientProfile: {
                        create: {
                            abhaNumber: patientData.abhaNumber,
                            demographics: patientData.demographics,
                        },
                    },
                },
                include: { patientProfile: true },
            });
        }

        const { accessToken, refreshToken } = await jwtUtils.generateTokens({
            id: user.id,
            role: user.role,
            abhaNumber: user.patientProfile.abhaNumber,
        });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                abhaNumber: user.patientProfile.abhaNumber,
            },
        });
    } catch (error) {
        logger.error(error, `Failed to verify ABHA OTP for txId: ${txId}`);
        next(error);
    }
};

const verifyHpr = async (req, res, next) => {
    const { hprId } = req.body;
    try {
        const doctorData = await hprService.verifyHprId(hprId);

        if (!doctorData.isPracticing || !doctorData.verified) {
             return res.status(403).json({ message: 'Healthcare professional is not verified or not currently practicing.' });
        }

        let user = await prisma.user.findFirst({
            where: { doctorProfile: { hprId: doctorData.hprId } },
            include: { doctorProfile: true },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: doctorData.name,
                    role: 'DOCTOR',
                    doctorProfile: {
                        create: {
                            hprId: doctorData.hprId,
                            speciality: doctorData.specialty,
                            verified: doctorData.verified,
                        },
                    },
                },
                include: { doctorProfile: true },
            });
        }

        const { accessToken, refreshToken } = await jwtUtils.generateTokens({
            id: user.id,
            role: user.role,
            hprId: user.doctorProfile.hprId,
        });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                hprId: user.doctorProfile.hprId,
                speciality: user.doctorProfile.speciality,
            },
        });

    } catch (error) {
        logger.error(error, `Failed to verify HPR ID: ${hprId}`);
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const { newAccessToken, newRefreshToken } = await jwtUtils.rotateRefreshToken(refreshToken);
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        logger.error(error, 'Refresh token rotation failed');
        next(error);
    }
};

const logout = async (req, res, next) => {
    const { refreshToken } = req.body;
    const { id: userId } = req.user;

    try {
        if (refreshToken) {
            const tokenHash = hashUtils.hashToken(refreshToken);
            await prisma.refreshToken.deleteMany({
                where: { tokenHash },
            });
        } else {
             // Fallback: if no refresh token is provided, log out all sessions for the user
            await prisma.refreshToken.deleteMany({
                where: { userId },
            });
        }
       
        res.status(204).send();
    } catch (error) {
        logger.error(error, `Logout failed for user ID: ${userId}`);
        next(error);
    }
};

module.exports = {
    sendAbhaOtp,
    verifyAbhaOtp,
    verifyHpr,
    refreshToken,
    logout,
};