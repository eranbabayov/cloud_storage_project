// models/patientModel.js

const db = require('./DataBase'); // Updated to use data_base.js

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


module.exports = {
    getMedication,
    getAllPatientMedications,
    getAllPatientsMedicationMapping
};
