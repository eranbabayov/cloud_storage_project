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
        const currentMedications = await medicationModel.getAllPatientMedications()
        const  PatientsMedicationMapping = await medicationModel.getAllPatientsMedicationMapping()
        res.render('patientMedications', { patients: patients, medications: medications, currentMedications: currentMedications , PatientsMedicationMapping: PatientsMedicationMapping});
      } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Internal Server Error');
      }
    
};

async function removeMedication(req, res) {
    try {
        const { patient_id, medication } = req.body;

        // Step 1: Get the current medications for the patient
        const currentMedications = await medicationModel.getMedicationsForPatient(patient_id);

        if (!currentMedications) {
            return res.json({ success: false, message: 'Patient not found.' });
        }

        // Step 2: Check if the medication exists
        let medicationsArray = currentMedications.split(',').map(med => med.trim());

        if (!medicationsArray.includes(medication)) {
            return res.json({ success: false, message: 'Medication not found for this patient.' });
        }

        // Step 3: Remove the selected medication
        medicationsArray = medicationsArray.filter(med => med !== medication);
        const updatedMedications = medicationsArray.join(', ');

        // Step 4: Update the patient's Medication field with the updated list
        const updateSuccess = await medicationModel.updateMedicationsForPatient(patient_id, updatedMedications);

        if (updateSuccess) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: 'Failed to remove medication.' });
        }
    } catch (error) {
        console.error('Error removing medication:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}

module.exports = {
    medications,
    editMedications
};
