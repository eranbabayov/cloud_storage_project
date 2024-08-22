// routes/patientRoutes.js
const multer = require('multer');

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new patient (POST request)
router.post('/add', upload.single('photo'), patientController.addPatient);
// router.post('/add', patientController.addPatient);

router.get('/get_patient_image/:id', patientController.getImage);

module.exports = router;
