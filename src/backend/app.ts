import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fileUpload, { UploadedFile } from 'express-fileupload';
import uploadFile from './gdrive'; // Make sure this path is correct

// Calculate the directory name (__dirname equivalent)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '../../vite-project/dist')));

// Temporary directory for storing files before upload to Google Drive
const tempDir = path.join(__dirname, 'temp');

// Route to handle video uploads
app.post('/upload-video', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const videoFile = req.files.video as UploadedFile;
    const tempFilePath = path.join(tempDir, videoFile.name);

    videoFile.mv(tempFilePath, async (err) => {
        if (err) {
            console.error('File move error:', err);
            return res.status(500).json({ error: 'Failed to save the file on the server.' });
        }

        try {
            await uploadFile(tempFilePath);
            fs.unlinkSync(tempFilePath); // Delete the temp file after upload
            res.json({ message: 'Video uploaded to Google Drive successfully!' });
        } catch (error) {
            console.error('Failed to upload to Google Drive:', error);
            res.status(500).json({ error: 'Failed to upload video to Google Drive.' });
        }
    });
});

// For any other requests, send `index.html` as an entry point to the SPA
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../vite-project/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
