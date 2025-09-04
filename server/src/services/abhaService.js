const axios = require('axios');
const config = require('../config');
const logger = require('../lib/logger');

const abhaApiClient = axios.create({
    baseURL: config.abha.baseUrl,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.abha.apiKey}`, // Assuming Bearer token auth, adjust if different
    },
});

const sendOtp = async (abhaNumber) => {
    try {
        const url = config.abha.paths.sendOtp;
        logger.info(`Sending ABHA OTP request to ${url} for ABHA number: ${abhaNumber}`);

        // MAPPER: Adjust this request payload based on your ABHA provider's requirements.
        const requestBody = {
            healthid: abhaNumber,
            authMethod: "MOBILE_OTP" // or AADHAAR_OTP, etc.
        };

        const response = await abhaApiClient.post(url, requestBody);
        
        // MAPPER: Adjust this mapping based on your ABHA provider's response.
        const txId = response.data.txnId;

        if (!txId) {
            throw new Error('Transaction ID not found in ABHA OTP response');
        }

        logger.info(`Successfully received txId from ABHA for ${abhaNumber}`);
        return { txId };
    } catch (error) {
        logger.error(error.response?.data || error.message, `ABHA OTP request failed for ${abhaNumber}`);
        throw error;
    }
};

const verifyOtp = async (txId, otp) => {
    try {
        const url = config.abha.paths.verifyOtp;
        logger.info(`Verifying ABHA OTP for txId: ${txId}`);

        // MAPPER: Adjust this request payload based on your ABHA provider's requirements.
        const requestBody = {
            txnId: txId,
            otp: otp,
        };

        const response = await abhaApiClient.post(url, requestBody);

        // MAPPER: Adjust this mapping based on your ABHA provider's response payload.
        // This example assumes the provider returns user details and a token.
        const { healthIdNumber, name, yearOfBirth, gender, mobile } = response.data.user || {};
        
        if (!healthIdNumber || !name) {
            throw new Error('Required patient data not found in ABHA verify response');
        }
        
        const canonicalPatient = {
            abhaNumber: healthIdNumber,
            name,
            demographics: {
                yob: yearOfBirth,
                gender,
                mobile,
            },
            abhaToken: response.data.token, // Store or use this token if needed for subsequent API calls
        };
        
        logger.info(`Successfully verified ABHA OTP and mapped patient data for ${healthIdNumber}`);
        return canonicalPatient;

    } catch (error) {
        logger.error(error.response?.data || error.message, `ABHA OTP verification failed for txId: ${txId}`);
        throw error;
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
};