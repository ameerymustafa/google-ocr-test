const express = require('express');
const cors = require('cors');
const multer = require('multer');
const vision = require('@google-cloud/vision');

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

process.env.GOOGLE_APPLICATION_CREDENTIALS = './credentials.json';
const client = new vision.ImageAnnotatorClient();

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Node API is actively listening on http://localhost:${PORT}`);
});