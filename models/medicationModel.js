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

async function getAllPatientsMedicationMapping(){
    try {
        const connection = await db.get_connection();
            const result = await connection.request().query(`WITH SplitMedications AS (
            SELECT
                Id AS PatientId,
                LTRIM(RTRIM(SUBSTRING(Medication, 1, CHARINDEX(',', Medication + ',') - 1))) AS MedicationName,
                SUBSTRING(Medication, CHARINDEX(',', Medication + ',') + 1, LEN(Medication)) AS RemainingMedications
            FROM
                Patients
            WHERE
                Medication IS NOT NULL AND LEN(Medication) > 0
            UNION ALL
            SELECT
                PatientId,
                LTRIM(RTRIM(SUBSTRING(RemainingMedications, 1, CHARINDEX(',', RemainingMedications + ',') - 1))) AS MedicationName,
                SUBSTRING(RemainingMedications, CHARINDEX(',', RemainingMedications + ',') + 1, LEN(RemainingMedications)) AS RemainingMedications
            FROM
                SplitMedications
            WHERE
                LEN(RemainingMedications) > 0
            )
            SELECT
                p.Id AS PatientId,
                sm.MedicationName,
                m.MedicationCode
            FROM
                SplitMedications sm
            JOIN
                medications m ON sm.MedicationName = m.MedicationName
            JOIN
                Patients p ON p.Id = sm.PatientId
            WHERE
                sm.MedicationName IS NOT NULL AND sm.MedicationName <> ''
            ORDER BY
            p.Id, sm.MedicationName;`)
            return result.recordset;
    } catch (err) {
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
    getAllPatientsMedicationMapping,
    getMedicationsForPatient,
    updateMedicationsForPatient,
    checkMedicationExists,
    getMedicationCode,
    getMedicationCodes
};
