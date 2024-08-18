const medicationModel = require('../models/medicationModel');

async function medications(req, res) {
    try {
        const medications = await medicationModel.getMedication();
        res.render('index', { medications });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving patients');
    }
}

module.exports = {
    medications
};
