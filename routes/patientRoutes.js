// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.listPatients);

module.exports = router;
