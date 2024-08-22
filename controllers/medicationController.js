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
        const  patientsOptionalMedicationsDict = await medicationModel.getdiseaseToMedicationsDict(patients)
        res.render('../public/patientMedications', { patients: patients, medications: medications, currentMedications: currentMedications , patientsOptionalMedicationsDict: patientsOptionalMedicationsDict});
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

async function addMedication(req, res) {
    try {
        console.log('Request received:', req.body);

        const { patient_id, medication } = req.body;

        // Log the medication being added for debugging purposes
        console.log('Adding medication:', medication);

        // Step 1: Check if the medication already exists for the patient
        const medicationExists = await medicationModel.checkMedicationExists(patient_id, medication);
        if (medicationExists) {
            return res.json({ success: false, message: 'Medication already exists for this patient.' });
        }

        // Step 2: Get the current medications for the patient
        let currentMedications = await medicationModel.getMedicationsForPatient(patient_id);
        console.log('Current Medications:', currentMedications);

        // Step 3: Normalize `currentMedications` to be a string or an empty string
        currentMedications = typeof currentMedications === 'string' ? currentMedications : '';

        // Convert `currentMedications` to an array, splitting by commas if it's not empty
        let currentMedicationsArray = currentMedications
            ? currentMedications.split(',').map(name => name.trim())
            : [];

        // Fetch the MedicationCode for the new medication
        const newMedicationCode = await medicationModel.getMedicationCode(medication);
        if (!newMedicationCode) {
            return res.json({ success: false, message: 'Medication code not found.' });
        }

        // Fetch the MedicationCodes for the existing medications
        const existingMedCodes = await medicationModel.getMedicationCodes(currentMedicationsArray);

        // Construct the API URL for checking drug interactions
        const apiUrl = `https://rest.kegg.jp/ddi/${newMedicationCode}+${existingMedCodes.join('+')}`;
        try {
            const apiResponse = await fetch(apiUrl);

            if (!apiResponse.ok) {
                // Skip the interaction check and insert directly if there's a 404 error
                if (apiResponse.status === 404) {
                    console.log('Skipping interaction check due to 404 error.');
                    currentMedicationsArray.push(medication);
                    await medicationModel.updateMedicationsForPatient(patient_id, currentMedicationsArray.join(', '));
                    console.log('Medication added successfully');
                    return res.json({ success: true, message: 'Medication added successfully.' });
                } else {
                    throw new Error(`HTTP error! status: ${apiResponse.status}`);
                }
            }

            const data = await apiResponse.text();

            // Step 4: Process the API response for contraindications or precautions
            const lines = data.split('\n');
            let hasContraindication = false;
            let hasPrecaution = false;

            lines.forEach(line => {
                const columns = line.split('\t');
                if (columns.length >= 4) {
                    const ci_p_value = columns[2];
                    if (ci_p_value === "CI,P" || ci_p_value === "CI") {
                        hasContraindication = true;
                    } else if (ci_p_value === "P") {
                        hasPrecaution = true;
                    }
                }
            });

            // Step 5: Handle the result from the API
            if (hasContraindication) {
                return res.json({
                    success: false,
                    message: 'Contraindication detected! Do not administer this medication. It may cause severe complications or death. Provide an alternative treatment immediately.'
                });
            } else if (hasPrecaution) {
                // Add the medication but alert the user about the precaution
                currentMedicationsArray.push(medication);
                await medicationModel.updateMedicationsForPatient(patient_id, currentMedicationsArray.join(', '));
                return res.json({
                    success: true,
                    message: 'Precaution! Administer this medication with caution. It may cause complications. Monitor the patient closely and consider alternative treatments if necessary.'
                });
            } else {
                // No issues, add the medication
                currentMedicationsArray.push(medication);
                await medicationModel.updateMedicationsForPatient(patient_id, currentMedicationsArray.join(', '));
                return res.json({ success: true, message: 'Medication added successfully.' });
            }
        } catch (apiError) {
            console.error('API error:', apiError);
            // If there's an error with the API (e.g., 404 or network issues), skip the check and insert the medication
            currentMedicationsArray.push(medication);
            await medicationModel.updateMedicationsForPatient(patient_id, currentMedicationsArray.join(', '));
            return res.json({ success: true, message: 'Medication added successfully, skipping API check.' });
        }
    } catch (error) {
        console.error('Error adding medication:', error);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}
module.exports = {
    medications,
    editMedications,
    removeMedication,
    addMedication
};
