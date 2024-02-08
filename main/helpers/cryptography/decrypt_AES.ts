import crypto from 'crypto';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export default async function handleDecryptSymmetricAES(event, keyHex, iv, user1Email, user2Email, fileName) {
  try {
    const appDataPath = app.getPath('appData');
    const appName = 'stream-safe';

    const streamSafePath = path.join(appDataPath, appName);
    if (!fs.existsSync(streamSafePath)) {
      // Create the folder
      fs.mkdirSync(streamSafePath);
      console.log('Folder created:', streamSafePath);
    }

    const keyBuffer = Buffer.from(keyHex, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

    let decryptedContent: Buffer = Buffer.alloc(0); // Initialize Buffer to store decrypted content

    const filePath = path.join(streamSafePath, 'videos', user1Email + '_' + user2Email, fileName);
    const input = fs.createReadStream(filePath);


    return new Promise((resolve, reject) => {
      // Handle events to accumulate decrypted content
      input.on('data', (chunk) => {
        const chunkBuffer = (typeof chunk === 'string') ? Buffer.from(chunk, 'binary') : chunk;
        decryptedContent = Buffer.concat([decryptedContent, decipher.update(chunkBuffer)]);
      });

      input.on('end', () => {
        decryptedContent = Buffer.concat([decryptedContent, decipher.final()]);
        resolve(decryptedContent)
      });

      // Handle errors during the decryption process
      decipher.on('error', (err) => reject(err));
      input.on('error', (err) => reject(err));
    });
  } catch (error) {
    console.error('Symmetric decryption failed:', error.message);
    return null;
  }
}