const diseaseModel = require('../models/diseaseModel');
const patientModel = require('../models/patientModel');

async function getDisease(req, res) {
    try {
        const diseases = await diseaseModel.getAllDiseases();
        res.render('index', { diseases });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving diseases');
    }
}

async function editDiseases(req, res){
    try {
        const diseases = await diseaseModel.getAllDiseases();
        const patients = await patientModel.getAllPatients();
        const currentDiseases = await diseaseModel.getAllPatientDiseases()
        console.log(diseases)
        res.render('../public/addOrRemoveDiseases', { patients: patients, diseases: diseases, currentDiseases: currentDiseases});
      } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
      }
    
};

async function addDisease(req, res) {
    try {
        const { patient_id, disease } = req.body;

        // Call the model function to add the new disease
        const result = await diseaseModel.addNewDisease(patient_id, disease);

        if (result.success) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error adding disease:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}


async function removeDisease(req, res) {
    try {
        const { patient_id, disease } = req.body;
        const result = await diseaseModel.removeDiseaseFromPatient(patient_id, disease);

        if (result.success) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error removing disease:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}

module.exports = {
    getDisease,
    editDiseases,
    addDisease,
    removeDisease
};
