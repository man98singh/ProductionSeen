import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import uploadFile from './gdrive.js'; // Adjust the path as necessary
// Calculate the directory name (__dirname equivalent)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(fileUpload()); // for parsing multipart/form-data
app.use(express.static(path.join(__dirname, '../../vite-project/dist'))); // Serve static files
// Temporary directory for storing files before upload to Google Drive
const tempDir = path.join(__dirname, 'temp');
// Route to handle video uploads
app.post('/upload-video', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    // The name 'video' corresponds to the name attribute in the form
    const videoFile = req.files.video;
    const tempFilePath = path.join(tempDir, videoFile.name);
    // Use the mv() method to save the file on the server
    videoFile.mv(tempFilePath, async (err) => {
        if (err)
            return res.status(500).send(err);
        // Upload the video file to Google Drive
        try {
            await uploadFile(tempFilePath); // Make sure this function is async
            fs.unlinkSync(tempFilePath); // Delete the temp file after upload
            res.send('Video uploaded to Google Drive successfully!');
        }
        catch (error) {
            console.error('Failed to upload to Google Drive:', error);
            res.status(500).send('Failed to upload video to Google Drive.');
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
