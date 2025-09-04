const { z } = require('zod');

// --- Auth Schemas ---
const sendAbhaOtpSchema = z.object({
    body: z.object({
        abhaNumber: z.string().min(1, 'ABHA number is required.'),
    }),
});

const verifyAbhaOtpSchema = z.object({
    body: z.object({
        txId: z.string().min(1, 'Transaction ID is required.'),
        otp: z.string().length(6, 'OTP must be 6 digits.'),
    }),
});

// --- ADDED: New Aadhaar schemas ---
const sendAadhaarOtpSchema = z.object({
    body: z.object({
        aadharNumber: z.string().length(12, 'Aadhaar number must be 12 digits.'),
    }),
});

const verifyAadhaarOtpSchema = z.object({
    body: z.object({
        txId: z.string().min(1, 'Transaction ID is required.'),
        otp: z.string().length(6, 'OTP must be 6 digits.'),
    }),
});

const hprRegisterSchema = z.object({
    body: z.object({
        hprId: z.string().min(1, 'HPR ID is required.'),
        password: z.string().min(8, 'Password must be at least 8 characters long.'),
    }),
});

const hprLoginSchema = z.object({
    body: z.object({
        hprId: z.string().min(1, 'HPR ID is required.'),
        password: z.string().min(1, 'Password is required.'),
    }),
});

const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required.'),
    }),
});

// --- Doctor Schemas ---
const findPatientSchema = z.object({
    query: z.object({
        abha: z.string().min(1, 'ABHA number query parameter is required.'),
    })
});

const codeSchema = z.object({
    system: z.string(),
    code: z.string(),
    display: z.string(),
});

const diagnosisSchema = z.object({
    name: z.string(),
    codes: z.array(codeSchema),
});

const medicationSchema = z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
});

const createConsultationSchema = z.object({
    body: z.object({
        patientAbha: z.string().min(1, 'Patient ABHA number is required.'),
        diagnoses: z.array(diagnosisSchema).min(1, 'At least one diagnosis is required.'),
        medications: z.array(medicationSchema).min(1, 'At least one medication is required.'),
        notes: z.string().optional(),
    }),
});

module.exports = {
    sendAbhaOtpSchema,
    verifyAbhaOtpSchema,
    sendAadhaarOtpSchema, // <-- EXPORTED
    verifyAadhaarOtpSchema, // <-- EXPORTED
    hprRegisterSchema,
    hprLoginSchema,
    refreshTokenSchema,
    findPatientSchema,
    createConsultationSchema,
};