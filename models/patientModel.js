// models/patientModel.js

const db = require('./DataBase'); // Updated to use data_base.js

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


async function add_new_client(name, age, gender, pregnancy, breast_feeding, phone_number, email, img) {
    try {
        console.log("Trying to insert a new patient into the database");

        const connection = await db.connect(); // Get the database connection from data_base.js

        // Prepare the SQL query with parameterized values to prevent SQL injection
        const query = `
            INSERT INTO Patients (Name, Sex, Pregnancy, Breastfeeding ,Age, Photo, Email, Phone, ChronicCondition)
            VALUES (@Name, @Sex, @Pregnancy, @Breastfeeding, @Age, @Photo, @Email, @Phone, NULL)
        `;

        // Use the connection to create a request and pass the parameters
        const request = connection.request();
        request.input('Name', sql.NVarChar, name);
        request.input('Sex', sql.NVarChar, gender);
        request.input('Pregnancy', sql.Bit, pregnancy);
        request.input('Breastfeeding', sql.Bit, breast_feeding);
        request.input('Age', sql.Int, age);
        request.input('Photo', sql.NVarChar, img);
        request.input('Email', sql.NVarChar, email);
        request.input('Phone', sql.NVarChar, phone_number);

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
