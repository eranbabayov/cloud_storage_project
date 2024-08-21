// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Route to add a new patient (POST request)
router.post('/add', patientController.addPatient);
router.post('/', patientController.listPatients);
router.get('/get_patient_image/:id', patientController.getImage);

module.exports = router;
