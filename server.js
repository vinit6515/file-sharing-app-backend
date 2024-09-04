const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for requests
app.use(cors());

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Serve static files
app.use(express.static('frontend'));



// Allow CORS for the frontend domain
app.use(cors({
  origin: 'https://compsc3.netlify.app/' // Replace with your actual frontend URL
}));

// Route to upload file
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully.');
});

// Route to list available files
app.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files!');
        }
        res.json(files);
    });
});

// Route to download file
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});