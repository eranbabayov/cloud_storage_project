const patientModel = require('../models/patientModel');
const { editDiseases } = require('./diseaseController');

async function addPatient(req, res) {
    try {
        // Extract parameters from the request body
        const { name, birthdate, gender, pregnancy, nursing, phone, email } = req.body;
        const img = req.file ? req.file.buffer : null; // Get the image buffer from the upload
        // Convert pregnancy and nursing to boolean if needed
        const pregnancyBool = pregnancy === '1';
        const nursingBool = nursing === '1';

        // Call the model's add_new_client function
        await patientModel.addNewPatient(name, birthdate, gender, pregnancyBool, nursingBool, phone, email, img);

        // Redirect or respond with success
        res.redirect('/');  // Redirect to home page
    } catch (err) {
        console.log(err);
        res.status(500).send('Error adding new patient');
    }
}

async function getImage(req, res) {
    const patientId = req.params.id;
    try{
        const result = await patientModel.getImageUsingId(patientId)
        // Check if image data is retrieved
        if (result.recordset.length > 0 && result.recordset[0].Photo) {
            const imageData = result.recordset[0].Photo;
    
            // Set the appropriate MIME type for the image
            res.setHeader('Content-Type', 'image/png'); // Adjust MIME type if necessary
  
            // Send the image data as the response
            res.send(imageData);
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } catch (err) {
        console.error('Error retrieving the image:', err);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

module.exports = {
    addPatient,
    editDiseases,
    getImage
};