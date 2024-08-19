const medicationModel = require('../models/medicationModel');
const patientModel = require('../models/patientModel');

async function medications(req, res) {
    try {
        const medications = await medicationModel.getMedication();
        res.render('index', { medications });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving patients');
    }
}

async function editMedications(req, res){
    try {
        const patients = await patientModel.getAllPatients();
        const medications = await medicationModel.getMedication();
        res.render('patientMedications', { patients: patients, medications: medications, currentMedications: [] });
      } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
      }
    
};

module.exports = {
    medications,
    editMedications
};
