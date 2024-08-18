
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

async function add_new_client(name, birthdate, gender, pregnancy, nursing, Phone, email, img) {

    try {
        const connection = await db.get_connection(); // Get the database connection from data_base.js
        // Prepare the SQL query with parameterized values to prevent SQL injection
        if (gender== 'male'){
            nursing = false
            breast_feeding = false
        }
        const query = `
            INSERT INTO Patients (Id, Name, Gender, Pregnancy, Nursing ,Birthdate, Photo, Email, Phone, ChronicCondition)
            VALUES (@Id, @Name, @gender, @Pregnancy, @nursing, @birthdate, @Photo, @Email, @Phone, NULL)
        `;
        
        // Use the connection to create a request and pass the parameters
        const request = connection.request();
        request.input('Id', sql.Int, 20);
        request.input('Name', sql.NVarChar, name);
        request.input('gender', sql.NVarChar, gender);
        request.input('Pregnancy', sql.Bit, pregnancy);
        request.input('nursing', sql.Bit, nursing);
        request.input('birthdate', sql.Date, birthdate);
        request.input('Photo', sql.NVarChar, img);
        request.input('Email', sql.NVarChar, email);
        request.input('Phone', sql.NVarChar, Phone);
        // Execute the query
        const result = await request.query(query);

        console.log('New patient added successfully:', result);
    } catch (err) {
        console.error('Error adding new patient:', err);
        throw err;
    }
}


module.exports = {
    getAllPatients,
    add_new_client
};
