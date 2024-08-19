const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
//const patientRoutes = require('./routes/patientRoutes');
const ChronicDiseaseRoutes = require('./routes/chronicDiseaseRoutes');
const medicationsRoutes = require('./routes/medicationsRoutes');

const path = require('path');

app.use(express.static(__dirname));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(express.static('public'));

app.set('view engine', 'ejs');

//app.use('/patient', patientRoutes);
app.use("/patient_chronic_disease", ChronicDiseaseRoutes);
app.use("/patient_medications", medicationsRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.post('/upload', async (req, res) => {
    // Get the file that was set to our field named "picture" 
    picture = req.files.picture
    picname = 'public/images/' + picture.name
    picture.mv(picname);
    console.log(picname)
  
    try {
      let result = await sendImageForTagging(picname)
      res.send(result)
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  
  })

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
