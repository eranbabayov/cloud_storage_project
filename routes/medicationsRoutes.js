const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/medicationController');

router.get('/', diseaseController.medications);

module.exports = router;
