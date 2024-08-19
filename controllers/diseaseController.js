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
        console.log(currentDiseases)
        res.render('addOrRemoveDiseases', { patients: patients, diseases: diseases, currentDiseases: currentDiseases});
      } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
      }
    
};


// async function editDiseases(req, res) {
//     try {
//         const patients = await patientModel.getAllPatients(); // Fetch all patients
//         const diseases = await diseaseModel.getAllDiseases(); // Fetch all diseases
//         const currentPatientDiseases = await diseaseModel.getDiseasesByPatientId(req.query.patient_id); // Fetch diseases for a specific patient

//         res.render('addOrRemoveDiseases', {
//             patients: patients,
//             diseases: diseases,
//             currentPatientDiseases: currentPatientDiseases
//         });
//     } catch (err) {
//         console.error('Error fetching data:', err);
//         res.status(500).send('Internal Server Error');
//     }
// }

module.exports = {
    getDisease,
    editDiseases,
};
