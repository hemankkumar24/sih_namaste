const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const config = require('../config');
const prisma = require('../lib/db');
const hashUtils = require('./hash');
const logger = require('../lib/logger');

const generateTokens = async (userPayload) => {
    const accessToken = jwt.sign(userPayload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiration,
    });
    
    const refreshToken = randomBytes(40).toString('hex');
    const tokenHash = hashUtils.hashToken(refreshToken);

    const expiresAt = new Date();
    // Parse duration string like "30d"
    const durationDays = parseInt(config.jwt.refreshExpiration, 10);
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    await prisma.refreshToken.create({
        data: {
            userId: userPayload.id,
            tokenHash,
            expiresAt,
        },
    });

    return { accessToken, refreshToken };
};


const rotateRefreshToken = async (oldRefreshToken) => {
    const oldTokenHash = hashUtils.hashToken(oldRefreshToken);
    
    // Find and atomically delete the old token
    const oldTokenRecord = await prisma.refreshToken.findUnique({
        where: { tokenHash: oldTokenHash },
        include: { user: { include: { patientProfile: true, doctorProfile: true } } },
    });

    if (!oldTokenRecord) {
        throw new Error('Refresh token not found.');
    }

    // Immediately delete the used token to prevent reuse
    await prisma.refreshToken.delete({ where: { id: oldTokenRecord.id } });

    if (oldTokenRecord.expiresAt < new Date()) {
        throw new Error('Refresh token has expired.');
    }

    const { user } = oldTokenRecord;
    
    // Construct payload for new token
    const userPayload = {
        id: user.id,
        role: user.role,
        ...(user.role === 'PATIENT' && { abhaNumber: user.patientProfile.abhaNumber }),
        ...(user.role === 'DOCTOR' && { hprId: user.doctorProfile.hprId }),
    };

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(userPayload);
    
    logger.info(`Rotated refresh token for user ID: ${user.id}`);
    return { newAccessToken, newRefreshToken };
};

module.exports = {
    generateTokens,
    rotateRefreshToken,
};