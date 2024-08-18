const diseaseModel = require('../models/diseaseModel');

async function getDisease(req, res) {
    try {
        const diseases = await diseaseModel.getAllDiseases();
        res.render('index', { diseases });
    } catch (err) {
        console.log(err)
        res.status(500).send('Error retrieving diseases');
    }
}

module.exports = {
    getDisease
};
