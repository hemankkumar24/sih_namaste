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

// --- FIXED: Generic patient search schema ---
const findPatientSchema = z.object({
    query: z.object({
        identifier: z.string().min(1, 'Patient identifier query parameter is required.'),
        type: z.enum(['abha', 'aadhar']).default('abha'),
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

// --- FIXED: Generic consultation creation schema ---
const createConsultationSchema = z.object({
    body: z.object({
        patientIdentifier: z.string().min(1, 'Patient identifier is required.'),
        identifierType: z.enum(['abha', 'aadhar']).default('abha'),
        diagnoses: z.array(diagnosisSchema).min(1, 'At least one diagnosis is required.'),
        medications: z.array(medicationSchema).min(1, 'At least one medication is required.'),
        notes: z.string().optional(),
    }),
});

module.exports = {
    sendAbhaOtpSchema,
    verifyAbhaOtpSchema,
    sendAadhaarOtpSchema,
    verifyAadhaarOtpSchema,
    hprRegisterSchema,
    hprLoginSchema,
    refreshTokenSchema,
    findPatientSchema,
    createConsultationSchema,
};