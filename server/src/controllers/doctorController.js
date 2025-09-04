const prisma = require('../lib/db');
const fhirService = require('../services/fhirService');
const logger = require('../lib/logger');

// --- FIXED: Renamed and generalized to find patient by any identifier ---
const findPatient = async (req, res, next) => {
    const { identifier, type } = req.query;
    if (!identifier) {
        return res.status(400).json({ message: 'Patient identifier query parameter is required.' });
    }

    try {
        const whereClause = type === 'aadhar' 
            ? { aadharNumber: identifier } 
            : { abhaNumber: identifier };

        const patientProfile = await prisma.patientProfile.findUnique({
            where: whereClause,
            include: {
                user: {
                    select: { name: true },
                },
            },
        });

        if (!patientProfile) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        res.status(200).json({
            abhaNumber: patientProfile.abhaNumber,
            aadharNumber: patientProfile.aadharNumber,
            name: patientProfile.user.name,
            demographics: patientProfile.demographics,
        });
    } catch (error) {
        logger.error(error, `Failed to find patient by ${type}: ${identifier}`);
        next(error);
    }
};

const createConsultation = async (req, res, next) => {
    // --- FIXED: Using generic identifier ---
    const { patientIdentifier, identifierType, diagnoses, medications, notes } = req.body;
    const doctorId = req.user.id; // From authMiddleware

    try {
        const whereClause = identifierType === 'aadhar'
            ? { aadharNumber: patientIdentifier }
            : { abhaNumber: patientIdentifier };

        const patient = await prisma.patientProfile.findUnique({
            where: whereClause,
            include: { user: true }
        });
        if (!patient) {
            return res.status(404).json({ message: `Patient with ${identifierType} number ${patientIdentifier} not found.` });
        }

        const doctor = await prisma.doctorProfile.findUnique({
            where: { userId: doctorId },
            include: { user: true }
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found for the current user.' });
        }

        const fhirBundle = fhirService.createFhirBundle({
            patientData: {
                id: patient.id,
                abhaNumber: patient.abhaNumber,
                name: patient.user.name,
                demographics: patient.demographics
            },
            doctorData: {
                id: doctor.id,
                hprId: doctor.hprId,
                name: doctor.user.name,
                specialty: doctor.speciality
            },
            diagnoses,
            medications
        });

        const consultation = await prisma.consultation.create({
            data: {
                patientId: patient.id,
                doctorId: doctor.id,
                diagnoses,
                medications,
                notes,
                fhirBundle,
            },
        });

        res.status(201).json({
            message: "Consultation created successfully. This FHIR Bundle would now be sent to the patient's linked Hospital EMR via a secure API.",
            consultation,
            fhirBundle,
        });
    } catch (error) {
        logger.error(error, 'Failed to create consultation.');
        next(error);
    }
};

const getConsultationById = async (req, res, next) => {
    const { id } = req.params;
    const doctorId = req.user.id;

    try {
        const consultation = await prisma.consultation.findFirst({
            where: {
                id,
                doctor: {
                    userId: doctorId
                }
            },
            include: {
                patient: { include: { user: { select: { name: true } } } },
                doctor: { include: { user: { select: { name: true } } } },
            },
        });

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found or you do not have permission to view it.' });
        }
        res.status(200).json(consultation);
    } catch (error) {
        logger.error(error, `Doctor failed to fetch consultation ID: ${id}`);
        next(error);
    }
};

module.exports = {
    findPatient, // Renamed export
    createConsultation,
    getConsultationById
};