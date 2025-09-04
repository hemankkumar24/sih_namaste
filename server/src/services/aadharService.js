const axios = require('axios');
const config = require('../config');
const logger = require('../lib/logger');

const aadharApiClient = axios.create({
    baseURL: config.aadhar.baseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': config.aadhar.apiKey, // Assuming API Key auth, adjust if different
    },
});

const sendOtp = async (aadharNumber) => {
    try {
        const url = config.aadhar.paths.sendOtp;
        logger.info(`Sending Aadhaar OTP request to ${url} for Aadhaar number.`);

        // MAPPER: Adjust this request payload based on your Aadhaar provider's requirements.
        const requestBody = {
            uid: aadharNumber,
            authType: "otp"
        };

        const response = await aadharApiClient.post(url, requestBody);
        
        // MAPPER: Adjust this mapping based on your Aadhaar provider's response.
        const txId = response.data.txnId;
        if (!txId) {
            throw new Error('Transaction ID not found in Aadhaar OTP response');
        }

        logger.info(`Successfully received txId from Aadhaar service.`);
        return { txId };
    } catch (error) {
        logger.error(error.response?.data || error.message, `Aadhaar OTP request failed.`);
        throw error;
    }
};

const verifyOtp = async (txId, otp) => {
    try {
        const url = config.aadhar.paths.verifyOtp;
        logger.info(`Verifying Aadhaar OTP for txId: ${txId}`);

        // MAPPER: Adjust this request payload based on your Aadhaar provider's requirements.
        const requestBody = {
            txnId: txId,
            otp: otp,
        };

        const response = await aadharApiClient.post(url, requestBody);

        // MAPPER: Adjust this mapping based on your Aadhaar provider's e-KYC response payload.
        // This example assumes the provider returns user demographic data.
        const { uid, name, gender, yob, mobile } = response.data.kyc || {};
        
        if (!uid || !name) {
            throw new Error('Required patient data not found in Aadhaar verify response');
        }
        
        const canonicalPatient = {
            aadharNumber: uid,
            name,
            demographics: {
                yob,
                gender: gender === 'M' ? 'male' : gender === 'F' ? 'female' : 'other',
                mobile,
            },
        };
        
        logger.info(`Successfully verified Aadhaar OTP and mapped patient data.`);
        return canonicalPatient;

    } catch (error) {
        logger.error(error.response?.data || error.message, `Aadhaar OTP verification failed for txId: ${txId}`);
        throw error;
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
};