const express = require('express');
const cors = require('cors');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const path = require('path');

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

let client;
if (process.env.GOOGLE_JSON_KEY) {
    // Live on Vercel: Read from the secure Vercel vault
    client = new vision.ImageAnnotatorClient({
        credentials: JSON.parse(process.env.GOOGLE_JSON_KEY)
    });
} else {
    // Local Testing: Read from the file
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../OcrApi/credentials.json');
    client = new vision.ImageAnnotatorClient();
}

app.post('/api/scan', upload.single('imageFile'), async (req, res) => {
    try {
        const [result] = await client.textDetection(req.file.buffer);
        const detections = result.textAnnotations;
        
        const text = detections.length > 0 ? detections[0].description : "No text found.";
        res.send(text);
    } catch (error) {
        console.error("Google Vision Error:", error);
        res.status(500).send("Error analyzing the image.");
    }
});

module.exports = app;

