const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

router.get('/edit_medications', medicationController.editMedications);
router.post('/remove_medication', medicationController.removeMedication);
router.post('/add_medication', medicationController.addMedication);

module.exports = router;
