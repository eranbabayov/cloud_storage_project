const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

router.get('/edit_medications', medicationController.editMedications);

module.exports = router;
