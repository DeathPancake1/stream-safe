import { app, ipcMain } from "electron";
import crypto from 'crypto'
import path from "path";
import fs from 'fs'
import axios from "axios";
import FromData from 'form-data'

export default async function handleEncryptSymmetricAESChannel  (event, keyHex, filePath, channelId, fileName, apiUrl, apiKey, jwt, type) {
    try{
      const appDataPath = app.getPath('appData');
      const appName = 'stream-safe';

      const streamSafePath = path.join(appDataPath, appName);
      if (!fs.existsSync(streamSafePath)) {
        // Create the folder
        fs.mkdirSync(streamSafePath);
      }

      // Create the cipher
      const keyBuffer = Buffer.from(keyHex, 'hex');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  
      const outputFileName = fileName + '.enc';
      if (!fs.existsSync(path.join(streamSafePath, 'videos'))) {
        // Create the folder
        fs.mkdirSync(path.join(streamSafePath, 'videos'));
      }
      const outputFilePath = path.join(streamSafePath, 'videos',channelId);
      if (!fs.existsSync(outputFilePath)) {
        // Create the folder
        fs.mkdirSync(outputFilePath);
      }
      fs.mkdir(outputFilePath, { recursive: true }, (err) => {
        if (err) throw err;
      });
      const fullPath = path.join(streamSafePath, 'videos', channelId, outputFileName);
  
      const input = fs.createReadStream(filePath)
      const output = fs.createWriteStream(fullPath)
      
      await input.pipe(cipher).pipe(output)
  
      return new Promise((resolve, reject) => {
        output.on('finish', async () => {
          const ivHex = iv.toString('hex');
          const encryptedFileContent = fs.createReadStream(fullPath);

          const formData = new FromData();
          formData.append("channelId", channelId);
          formData.append("name", fileName);
          formData.append("iv", ivHex);
          formData.append("type", type);
          formData.append("file", encryptedFileContent, fileName+'.enc')

          // Axios request with a stream-based approach
          try {
            const response = await axios.post(apiUrl, formData, {
              headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/octet-stream',
                'api-key': apiKey,
                ...formData.getHeaders()
              },
            });

            resolve({ iv: ivHex });
          } catch (apiError) {
            reject(apiError);
          }
        });
        // Handle errors during the encryption process
        cipher.on('error', (err) => reject(err));
        input.on('error', (err) => reject(err));
      });
    } catch(error){
      console.error(error.message)
    }
};
