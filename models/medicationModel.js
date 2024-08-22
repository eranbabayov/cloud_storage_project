// models/patientModel.js

const db = require('./DataBase'); // Updated to use data_base.js
const sql = require('mssql');

async function getMedication() {
    try {
        console.log("Try to get patients from db")
        const connection = await db.get_connection(); // Using the connect function from data_base.js
        const result = await connection.request().query('SELECT * FROM Medications');
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function getAllPatientMedications() {
    try {
        const connection = await db.get_connection();
        const result = await connection.request().query(`
            SELECT Id as patient_id, Medication
            FROM Patients
            WHERE Medication IS NOT NULL
        `);
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function getdiseaseToMedicationsDict(patients) {
    try {
        const connection = await db.get_connection();

        // Get all diseases
        const result = await connection.request().query(`SELECT DiseaseName, DiseaseCode FROM Diseases;`);
        const allDiseases = result.recordset;
        let diseasesDict = {};

        // Build the diseases dictionary
        allDiseases.forEach(disease => {
            diseasesDict[disease.DiseaseCode] = disease.DiseaseName;
        });

        // Get all medications
        const medicationsResult = await connection.request().query(`SELECT MedicationName, MedicationCode FROM Medications`);
        const allMedications = medicationsResult.recordset;
        let medicationsDict = {};

        // Build the medications dictionary
        allMedications.forEach(medication => {
            medicationsDict[medication.MedicationCode] = medication.MedicationName;
        });

        // Fetch data from the KEGG API
        const res = await fetch("https://rest.kegg.jp/link/drug/disease");
        const data = await res.text();

        // Split the data into lines and create a mapping of disease to medications
        const lines = data.split('\n');
        let diseaseToMedicationsDict = {};

        lines.forEach(line => {
            const [diseaseCode, drugCode] = line.split('\t');

            if (diseasesDict[diseaseCode.replace('ds:', '')]) {
                const diseaseName = diseasesDict[diseaseCode.replace('ds:', '')];
                const medicationCode = drugCode.replace('dr:', '');

                if (!diseaseToMedicationsDict[diseaseName]) {
                    diseaseToMedicationsDict[diseaseName] = [];
                }

                // Add medication name instead of medication code
                if (medicationsDict[medicationCode]) {
                    diseaseToMedicationsDict[diseaseName].push(medicationsDict[medicationCode]);
                }
            }
        });
        let patientsOptionalMedicationsDict = {}
        patients.forEach(patient => {
            if (patient.ChronicCondition == null)	{
                patientsOptionalMedicationsDict[patient.Id] = "Choosen patients feeling good"
        }
            else{
                if (!patientsOptionalMedicationsDict[patient.Id]) {
                    patientsOptionalMedicationsDict[patient.Id] = [];
                }
                patientChronicConditions = patient.ChronicCondition.split(',');
                patientChronicConditions.forEach(patientChronicCondition=>{
                    patientChronicCondition = patientChronicCondition.trim();
                    diseaseToMedicationsDict[patientChronicCondition].forEach(patientChronicCondition=>{
                        patientsOptionalMedicationsDict[patient.Id] = patientsOptionalMedicationsDict[patient.Id].concat(patientChronicCondition)}
                )})
    //                patientsOptionalMedicationsDict[patient.Name] = patientsOptionalMedicationsDict[patient.Name].concat(diseaseToMedicationsDict[patientChronicCondition].split(','))
                }})

        return patientsOptionalMedicationsDict;
        }

     catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }

}

async function getMedicationsForPatient(patient_id) {
    try {
        const connection = await db.get_connection();
        const result = await connection.request()
            .input('patientId', sql.Int, patient_id) // Use .input() to add parameter
            .query('SELECT Medication FROM Patients WHERE Id = @patientId'); // Use named parameter
        return result.recordset[0].Medication;
    } catch (error) {
        console.error('Error fetching medications:', error);
        throw error;
    }
}

async function updateMedicationsForPatient(patient_id, updatedMedications) {
    try {
        const connection = await db.get_connection();
        const result = await connection.request()
            .input('updatedMedications', sql.VarChar, updatedMedications) // Use .input() for updatedMedications
            .input('patientId', sql.Int, patient_id) // Use .input() for patient_id
            .query('UPDATE Patients SET Medication = @updatedMedications WHERE Id = @patientId'); // Use named parameters

        return result.rowsAffected[0] > 0; // Check if any rows were updated
    } catch (error) {
        console.error('Error updating medications:', error);
        throw error;
    }
}

async function checkMedicationExists(patient_id, medication) {
    try {
        const connection = await db.get_connection();
        const result = await connection.request()
            .input('patientId', sql.Int, patient_id)
            .query('SELECT Medication FROM Patients WHERE Id = @patientId');

        if (result.recordset.length === 0) {
            throw new Error('Patient not found.');
        }

        let currentMedications = result.recordset[0].Medication;

        if (currentMedications) {
            let medicationsArray = currentMedications.split(',').map(med => med.trim());
            return medicationsArray.includes(medication); // Return true if the medication already exists
        }

        return false; // Return false if no medications exist yet
    } catch (error) {
        console.error('Error checking medication:', error);
        throw error;
    }
}

async function getMedicationCode(medicationName) {
    try {
        const connection = await db.get_connection();
        const result = await connection.request()
            .input('medicationName', sql.VarChar, medicationName)
            .query('SELECT MedicationCode FROM Medications WHERE MedicationName = @medicationName');

        return result.recordset.length > 0 ? result.recordset[0].MedicationCode : null;
    } catch (error) {
        console.error('Error fetching medication code:', error);
        throw error;
    }
}

async function getMedicationCodes(medicationNamesArray) {
    try {

        const connection = await db.get_connection();
        const request = connection.request();

        // Dynamically add each medication name as a parameter
        medicationNamesArray.forEach((name, index) => {
            request.input(`name${index}`, sql.VarChar, name);
        });
        // Generate the SQL query with dynamic parameters
        const query = `SELECT MedicationCode FROM Medications WHERE MedicationName IN (${medicationNamesArray.map((_, index) => `@name${index}`).join(', ')})`;

        const result = await request.query(query);

        return result.recordset.map(row => row.MedicationCode);
    } catch (error) {
        console.error('Error fetching medication codes:', error);
        throw error;
    }
}


module.exports = {
    getMedication,
    getAllPatientMedications,
    getdiseaseToMedicationsDict,
    getMedicationsForPatient,
    updateMedicationsForPatient,
    checkMedicationExists,
    getMedicationCode,
    getMedicationCodes
};
