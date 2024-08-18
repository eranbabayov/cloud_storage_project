// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.listPatients);

// Route to add a new patient (POST request)
router.post('/add', patientController.addPatient);

module.exports = router;
