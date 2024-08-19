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
        res.render('addOrRemoveDiseases', { patients: patients, diseases: diseases, currentDiseases: [] });
      } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
      }
    
};


module.exports = {
    getDisease,
    editDiseases
};
