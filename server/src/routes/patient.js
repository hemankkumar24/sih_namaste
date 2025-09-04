const express = require('express');
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All patient routes are protected
router.use(authMiddleware);
router.use(roleMiddleware('PATIENT'));

router.get('/records', patientController.getConsultations);
router.get('/records/:id', patientController.getConsultationById);
router.get('/records/:id/pdf', patientController.downloadConsultationPdf);

module.exports = router;