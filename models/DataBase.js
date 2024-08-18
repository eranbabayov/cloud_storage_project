// models/db.js

const sql = require('mssql');

const config = {
    user: 'CChit2024_SQLLogin_1',
    password: 'vkjg9fyzpi',
    server: 'CCHitMed.mssql.somee.com',
    database: 'CCHitMed',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        packetSize: 4096
    }
};
let pool;

async function get_connection() {
    try {
        // Check if the connection pool already exists and is connected
        if (pool && pool.connected) {
            console.log('Using existing database connection.');
            return pool;
        }

        // Otherwise, create a new connection pool
        pool = await sql.connect(config);
        console.log('Connected to the database successfully!');

        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}

module.exports = {
    get_connection,
    sql
};
