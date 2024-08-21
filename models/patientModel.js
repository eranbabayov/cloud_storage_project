
const db = require('./DataBase'); // Updated to use data_base.js
const sql = require('mssql');

async function getAllPatients() {
    try {
        console.log("Try to get patients from db")
        const connection = await db.get_connection(); // Using the connect function from data_base.js
        const result = await connection.request().query('SELECT * FROM Patients');
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}

async function getImageUsingId(patientId){
    try {
        // Get the database connection
        const pool = await db.get_connection();
  
        // Query to retrieve the image
        const query = `
            SELECT Photo
            FROM Patients
            WHERE Id = @PatientId
        `;
  
        // Execute the query and get the image data
        const result = await pool.request()
            .input('PatientId', db.sql.Int, patientId)
            .query(query);

        return result

    }
    catch(error){
        console.error('Error adding new patient:', err);
        throw err;

    }
}
async function addNewPatient(name, birthdate, gender, pregnancy, nursing, Phone, email, img) {
    try {
        const connection = await db.get_connection();

        if (gender.toLowerCase() === 'male') {
            nursing = false;
            pregnancy = false;
        }

        const maxIdResult = await connection.request().query('SELECT ISNULL(MAX(Id), 0) AS MaxId FROM Patients');
        const maxId = maxIdResult.recordset[0].MaxId;

        const query = `
            INSERT INTO Patients (Id, Name, Gender, Pregnancy, Nursing, Birthdate, Photo, Email, Phone, ChronicCondition)
            VALUES (@Id, @Name, @gender, @Pregnancy, @nursing, @birthdate, @Photo, @Email, @Phone, NULL)
        `;

        const request = connection.request();
        request.input('Id', sql.Int, maxId + 1);
        request.input('Name', sql.NVarChar, name);
        request.input('gender', sql.NVarChar, gender);
        request.input('Pregnancy', sql.Bit, pregnancy);
        request.input('nursing', sql.Bit, nursing);
        request.input('birthdate', sql.Date, birthdate);
        request.input('Photo', sql.VarBinary(sql.MAX), img)
        request.input('Email', sql.NVarChar, email);
        request.input('Phone', sql.NVarChar, Phone);

        await request.query(query);
    } catch (err) {
        console.error('Error adding new client:', err);
        throw err;
    }
}


module.exports = {
    getAllPatients,
    addNewPatient,
    getImageUsingId
};
