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


module.exports = {
    getAllDiseases,
    getDiseasesByPatientId,
    getAllPatientDiseases
};
