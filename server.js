const express = require('express');
const app = express();
const patientRoutes = require('./routes/patientRoutes');
const ChronicDiseaseRoutes = require('./routes/chronicDiseaseRoutes');
const medicationsRoutes = require('./routes/medicationsRoutes');

const path = require('path');

app.use(express.static(__dirname));

//app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use('/patient', patientRoutes);
app.use("/client_chronic_disease", ChronicDiseaseRoutes);
app.use("/patient_medications", medicationsRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
