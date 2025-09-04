const axios = require('axios');
const config = require('../config');
const logger = require('../lib/logger');

const hprApiClient = axios.create({
    baseURL: config.hpr.baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.hpr.apiKey}`,
    },
});

const verifyHprId = async (hprId) => {
    try {
        // HPR verification might be a GET or POST. This example assumes POST.
        const url = config.hpr.paths.verify;
        logger.info(`Verifying HPR ID: ${hprId} at ${url}`);
        
        // MAPPER: Adjust request payload as needed by your HPR provider.
        const requestBody = { hprId };

        const response = await hprApiClient.post(url, requestBody);
        
        // MAPPER: Adjust this mapping based on your HPR provider's response payload.
        // This example assumes a simple response structure.
        const { hprId: respHprId, name, specialty, isPracticing, verified } = response.data;
        
        if (!respHprId || !name) {
            throw new Error('Required doctor data not found in HPR response');
        }

        const canonicalDoctor = {
            hprId: respHprId,
            name,
            specialty: specialty || 'General Practice',
            isPracticing: isPracticing === true,
            verified: verified === true,
        };

        logger.info(`Successfully verified and mapped HPR data for ${hprId}`);
        return canonicalDoctor;
    } catch (error) {
        logger.error(error.response?.data || error.message, `HPR verification failed for ${hprId}`);
        throw error;
    }
};

module.exports = {
    verifyHprId,
};