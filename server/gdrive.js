import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
// Google API client setup
const CLIENT_ID = '630271564715-5dkam4196e9vlqr1sqa150jen685rheh.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04Kmv_uCyT4CeCgYIARAAGAQSNwF-L9Irun0zn2lF9RQegyDJ-4Uy67RpZLxyP6RBLnD7KNV-O6UXcgpSGtsX04ZBHqtMDRRdNAE';
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const driveService = google.drive({
    version: 'v3',
    auth: oauth2Client,
});
export default async function uploadFile(filePath) {
    try {
        const response = await driveService.files.create({
            requestBody: {
                name: path.basename(filePath),
                parents: ['1XiATAV4DYRiTsrp6bjVjeq4nJIiEXIYu'],
                mimeType: 'video/webm',
            },
            media: {
                mimeType: 'video/webm',
                body: fs.createReadStream(filePath),
            },
        });
        console.log('Uploaded File ID:', response.data.id);
    }
    catch (error) {
        console.error('Failed to upload file:', error.message);
        throw error; // Rethrow or handle as needed
    }
}
