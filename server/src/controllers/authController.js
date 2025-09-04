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

// --- ADDED: New function for Doctor Registration ---
const hprRegister = async (req, res, next) => {
    const { hprId, password } = req.body;
    try {
        // 1. Verify doctor's status with the HPR service
        const doctorData = await hprService.verifyHprId(hprId);
        if (!doctorData.isPracticing || !doctorData.verified) {
            return res.status(403).json({ message: 'Healthcare professional is not verified or not currently practicing.' });
        }

        // 2. Check if a doctor with this HPR ID already exists
        const existingUser = await prisma.user.findFirst({
            where: { doctorProfile: { hprId: doctorData.hprId } },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'A user with this HPR ID already exists. Please login.' });
        }

        // 3. Hash the password
        const hashedPassword = await hashUtils.hashPassword(password);

        // 4. Create the new user and profile
        const user = await prisma.user.create({
            data: {
                name: doctorData.name,
                role: 'DOCTOR',
                password: hashedPassword, // Store the hashed password
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

        // 5. Generate and return tokens
        const { accessToken, refreshToken } = await jwtUtils.generateTokens({
            id: user.id,
            role: user.role,
            hprId: user.doctorProfile.hprId,
        });

        res.status(201).json({
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
        logger.error(error, `HPR Registration failed for ${hprId}`);
        next(error);
    }
};

// --- ADDED: New function for Doctor Login ---
const hprLogin = async (req, res, next) => {
    const { hprId, password } = req.body;
    try {
        // 1. CRITICAL: Always check live status with HPR service first
        const doctorData = await hprService.verifyHprId(hprId);
        if (!doctorData.isPracticing || !doctorData.verified) {
            return res.status(403).json({ message: 'HPR status is not active. Access denied.' });
        }

        // 2. Find the user in our database
        const user = await prisma.user.findFirst({
            where: { doctorProfile: { hprId: hprId } },
            include: { doctorProfile: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }

        // 3. Compare the provided password with the stored hash
        const isPasswordValid = await hashUtils.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid HPR ID or password.' });
        }

        // 4. Generate and return tokens
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
        logger.error(error, `HPR Login failed for ${hprId}`);
        next(error);
    }
};


const refreshToken = async (req, res, next) => {
    // ... (This function remains unchanged)
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
    // ... (This function remains unchanged)
    const { refreshToken } = req.body;
    const { id: userId } = req.user;

    try {
        if (refreshToken) {
            const tokenHash = hashUtils.hashToken(refreshToken);
            await prisma.refreshToken.deleteMany({
                where: { tokenHash },
            });
        } else {
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
    hprRegister, // <-- EXPORTED
    hprLogin,    // <-- EXPORTED
    refreshToken,
    logout,
};