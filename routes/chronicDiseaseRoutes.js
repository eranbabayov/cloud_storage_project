const express = require('express');
const router = express.Router();
const diseaseController = require('../controllers/diseaseController');

router.get('/edit-diseases', diseaseController.editDiseases);

router.get('/', diseaseController.getDisease);

router.post('/add_disease', diseaseController.addDisease);

router.post('/remove_disease', diseaseController.removeDisease);

module.exports = router;

module.exports = router;