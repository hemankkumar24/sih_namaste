const express = require('express');
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { createConsultationSchema, findPatientSchema } = require('../utils/validators');

const router = express.Router();

// All doctor routes are protected
router.use(authMiddleware);
router.use(roleMiddleware('DOCTOR'));

// --- FIXED: Updated to use the new controller function ---
router.get('/patients', validate(findPatientSchema), doctorController.findPatient);

router.post('/consultation', validate(createConsultationSchema), doctorController.createConsultation);
router.get('/consultation/:id', doctorController.getConsultationById);

module.exports = router;