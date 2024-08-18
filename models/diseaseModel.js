const db = require('./DataBase'); // Updated to use data_base.js

async function getAllDiseases() {
    try {
        console.log("Try to get diseases from db")
        const connection = await db.get_connection(); // Using the connect function from data_base.js
        const result = await connection.request().query('SELECT * FROM Patients');
        return result.recordset;
    } catch (err) {
        console.error('Error querying the database:', err);
        throw err;
    }
}
module.exports = {
    getAllDiseases,
};
