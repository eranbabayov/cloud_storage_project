const fs = require('fs').promises;

const { checkImage } = require('../models/checkImage.js');  // Use require to load the checkImage module
let image_path = "C:\\Users\\danab\\OneDrive\\שולחן העבודה\\Hit\\שנה ג\\סמסטר ב'\\מחשוב ענן\\cloud_storage_project\\img\\favicon.png"
const imageBuffer = await fs.readFile(image_path);

checkImage(imageBuffer)