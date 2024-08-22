const db = require('./DataBase'); // Updated to use data_base.js
const sql = require('mssql');

async function getAllDiseases() {
    try {
        console.log("Try to get diseases from db")
        const connection = await db.get_connection(); // Using the connect function from data_base.js
        const result = await connection.request().query(`SELECT ChronicCondition FROM Patients
                                                        GROUP BY ChronicCondition HAVING CHARINDEX(',', ChronicCondition) = 0 
                                                        AND ChronicCondition IS NOT NULL;`);
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function getDiseasesByPatientId(patient_id) {
    try {
        const connection = await db.get_connection(); // Ensure you have a function to get the connection
        const request = connection.request();

        // Add the parameter to the request
        request.input('patient_id', sql.Int, patient_id); // Assuming `Id` is an integer, adjust the type if necessary

        // Use a parameterized query
        const result = await request.query('SELECT ChronicCondition FROM Patients WHERE Id = @patient_id');

        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function addNewDisease(patient_id, newDisease) {
    try {
        const connection = await db.get_connection();

        // Step 1: Get the current diseases for the patient
        const result = await connection.request()
            .input('patientId', sql.Int, patient_id)
            .query('SELECT ChronicCondition FROM Patients WHERE Id = @patientId');

        if (result.recordset.length === 0) {
            throw new Error('Patient not found');
        }

        let currentDiseases = result.recordset[0].ChronicCondition;

        // Step 2: Check if the disease already exists
        if (currentDiseases && currentDiseases.split(',').map(d => d.trim()).includes(newDisease)) {
            return { success: false, message: 'Patient already has this disease.' };
        }

        // Step 3: Append the new disease to the existing list
        let updatedDiseases;
        if (currentDiseases) {
            updatedDiseases = `${currentDiseases}, ${newDisease}`;
        } else {
            updatedDiseases = newDisease;
        }

        // Step 4: Update the patient's ChronicCondition field with the new disease list
        const updateResult = await connection.request()
            .input('updatedDiseases', sql.NVarChar, updatedDiseases)
            .input('patientId', sql.Int, patient_id)
            .query('UPDATE Patients SET ChronicCondition = @updatedDiseases WHERE Id = @patientId');

        // Step 5: Check if the update was successful
        if (updateResult.rowsAffected[0] > 0) {
            return { success: true };
        } else {
            return { success: false, message: 'Failed to add disease.' };
        }
    } catch (error) {
        console.error('Error adding disease:', error);
        throw error;
    }
}

async function getAllPatientDiseases() {
    try {
        const connection = await db.get_connection();
        const result = await connection.request().query(`
            SELECT Id as patient_id, ChronicCondition
            FROM Patients
            WHERE ChronicCondition IS NOT NULL
        `);
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function removeDiseaseFromPatient(patient_id, disease) {
    try {
        const connection = await db.get_connection();
        const result = await connection.request()
            .input('patientId', sql.Int, patient_id)
            .query('SELECT ChronicCondition FROM Patients WHERE Id = @patientId');

        if (result.recordset.length === 0) {
            throw new Error('Patient not found.');
        }
        let currentDiseases = result.recordset[0].ChronicCondition;
        let diseasesArray = currentDiseases.split(',').map(element => element.trim());
        if (!diseasesArray.includes(disease)) {
            return { success: false, message: 'Disease not found for this patient.', diseasesArray };
        }

        diseasesArray = diseasesArray.filter(d => d !== disease);
        const updatedDiseases = diseasesArray.join(', ');

        const updateResult = await connection.request()
            .input('updatedDiseases', sql.NVarChar, updatedDiseases)
            .input('patientId', sql.Int, patient_id)
            .query('UPDATE Patients SET ChronicCondition = @updatedDiseases WHERE Id = @patientId');

        if (updateResult.rowsAffected[0] > 0) {
            return { success: true };
        } else {
            return { success: false, message: 'Failed to remove disease.' };
        }
    } catch (error) {
        console.error('Error removing disease:', error);
        throw error;
    }
}

module.exports = {
    getAllDiseases,
    getDiseasesByPatientId,
    getAllPatientDiseases,
    addNewDisease,
    removeDiseaseFromPatient
};
