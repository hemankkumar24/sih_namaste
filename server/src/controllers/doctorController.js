const prisma = require('../lib/db');
const fhirService = require('../services/fhirService');
const logger = require('../lib/logger');

const findPatientByAbha = async (req, res, next) => {
    const { abha } = req.query;
    if (!abha) {
        return res.status(400).json({ message: 'ABHA number query parameter is required.' });
    }

    try {
        const patientProfile = await prisma.patientProfile.findUnique({
            where: { abhaNumber: abha },
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
            name: patientProfile.user.name,
            demographics: patientProfile.demographics,
        });
    } catch (error) {
        logger.error(error, `Failed to find patient by ABHA: ${abha}`);
        next(error);
    }
};

const createConsultation = async (req, res, next) => {
    const { patientAbha, diagnoses, medications, notes } = req.body;
    const doctorId = req.user.id; // From authMiddleware

    try {
        const patient = await prisma.patientProfile.findUnique({
            where: { abhaNumber: patientAbha },
            include: { user: true }
        });
        if (!patient) {
            return res.status(404).json({ message: `Patient with ABHA number ${patientAbha} not found.` });
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
    findPatientByAbha,
    createConsultation,
    getConsultationById
};