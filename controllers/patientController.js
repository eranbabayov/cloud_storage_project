// controllers/patientController.js

const patientModel = require('../models/patientModel');

async function listPatients(req, res) {
    try {
        const patients = await patientModel.getAllPatients();
        res.render('index', { patients });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving patients');
    }
}

module.exports = {
    listPatients
};
