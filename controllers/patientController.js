const patientModel = require('../models/patientModel');
const { editDiseases } = require('./diseaseController');

async function listPatients(req, res) {
    try {
        const patients = await patientModel.getAllPatients();
        res.render('index', { patients });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving patients');
    }
}


async function listPatients(req, res) {
    try {
        const patients = await patientModel.getAllPatients();
        res.render('index', { patients });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving patients');
    }
}

async function addPatient(req, res) {
    try {
        // Extract parameters from the request body
        const { name, birthdate, gender, pregnancy, nursing, phone, email } = req.body;
        const img = req.file; // Assuming you handle the image as a file upload
        // Convert pregnancy and nursing to boolean if needed
        const pregnancyBool = pregnancy === '1';
        const nursingBool = nursing === '1';

        // Call the model's add_new_client function
        await patientModel.add_new_client(name, birthdate, gender, pregnancyBool, nursingBool, phone, email, img);

        // Redirect or respond with success
        res.redirect('/patient');  // Redirect to the patient list page
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding new patient');
    }
}


module.exports = {
    listPatients,
    addPatient,
    editDiseases
};