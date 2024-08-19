const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/edit-diseases', diseaseController.editDiseases);

router.get('/', diseaseController.getDisease);

module.exports = router;