import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import connection from "./data_base.js"; todo: from the database connection

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the "public" directory
app.use(express.static(__dirname));

//connection(); todo: connect to the database

// Route to serve index.html on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
