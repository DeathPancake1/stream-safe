import { join } from "path";
import fs from 'fs';
import axios from "axios";
import { app } from "electron";

export default async function writeFileChannel (event, channelId, fileName, jwt, url, apiKey, path)  {
    const appDataPath = app.getPath('appData');
    const appName = 'stream-safe';

    const streamSafePath = join(appDataPath, appName);
    if (!fs.existsSync(streamSafePath)) {
        // Create the folder
        fs.mkdirSync(streamSafePath);
    }
    const outputFilePath = join(streamSafePath, 'videos', channelId);
    fs.mkdir(outputFilePath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    const fullPath = join(outputFilePath, fileName);

    // Create a writable stream for the file
    const file = fs.createWriteStream(fullPath);

    // Use axios to download the file
    axios.defaults.headers.common['api-key']=`${apiKey}`
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
    const response = await axios.post(
        url,
        {
            path: path
        },
        {
            responseType: 'stream',
            onUploadProgress(progress){

            }
        }
    )
    // Pipe the response data to the file
    response.data.pipe(file);

    return new Promise((resolve, reject) => {
        file.on('finish', () => resolve(true));
        file.on('error', reject);
    });
}