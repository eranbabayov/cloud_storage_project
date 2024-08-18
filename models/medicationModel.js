// models/patientModel.js

const db = require('./DataBase'); // Updated to use data_base.js

async function getMedication() {
    try {
        console.log("Try to get patients from db")
        const connection = await db.get_connection(); // Using the connect function from data_base.js
        const result = await connection.request().query('SELECT * FROM Medication');
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}


module.exports = {
    getMedication,
};
