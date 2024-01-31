import { ipcMain } from "electron";
import crypto from 'crypto'
import path from "path";
import fs from 'fs'

// Always make user1Email your own email
export default async function handleEncryptSymmetricAES  (event, keyHex, filePath, user1Email, user2Email, fileName) {
    try{
      // Create the cipher
      const keyBuffer = Buffer.from(keyHex, 'hex');
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  
      const outputFileName = fileName + '.enc';
      const outputFilePath = path.join('videos',user1Email + '_' + user2Email);
      fs.mkdir(outputFilePath, { recursive: true }, (err) => {
        if (err) throw err;
      });
      const fullPath = path.join('videos',user1Email + '_' + user2Email, outputFileName);
  
      const input = fs.createReadStream(filePath)
      const output = fs.createWriteStream(fullPath)
      
      await input.pipe(cipher).pipe(output)
  
      return new Promise((resolve, reject) => {
        output.on('finish', async () => {
          // Read the content of the encrypted file
          const encryptedFileContent = await fs.promises.readFile(fullPath);
          
          // Resolve with the File object
          resolve(encryptedFileContent);
        });
  
        // Handle errors during the encryption process
        cipher.on('error', (err) => reject(err));
        input.on('error', (err) => reject(err));
      });
    } catch(error){
      console.error(error.message)
    }
};
