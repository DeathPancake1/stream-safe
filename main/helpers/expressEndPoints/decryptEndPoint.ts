import express from 'express'
import crypto from 'crypto'
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import range from 'range-parser';

const decryptRouter = express.Router()

let keyHexGlobal = ''
let ivHexGlobal = ''

export async function setKeys (event, keyHex, ivHex)  {
    // Implement the actual symmetric key generation using crypto module
    // TODO: Add nonce
    keyHexGlobal = keyHex
    ivHexGlobal = ivHex
    return true;
}

decryptRouter.get('/decrypt/:user1Email/:user2Email/:fileName', async (req, res) => {
    const { user1Email, user2Email, fileName } = req.params;
  
    try {
      const appDataPath = app.getPath('appData');
      const appName = 'stream-safe';
      const streamSafePath = path.join(appDataPath, appName);
  
      if(!keyHexGlobal || !ivHexGlobal){
        res.status(401).send('Unauthorized');
        return;
      }
      
      const keyBuffer = Buffer.from(keyHexGlobal, 'hex');
      const ivBuffer = Buffer.from(ivHexGlobal, 'hex');

      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
      decipher.setAutoPadding(false); 
  
      const filePath = path.join(streamSafePath, 'videos', user1Email + '_' + user2Email, fileName);
  
      if (!fs.existsSync(filePath)) {
        res.status(404).send('File not found');
        return;
      }
  
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
  
      // Parse range headers
      const rangeHeader = req.headers.range;
      const ranges = rangeHeader ? range(fileSize, rangeHeader, { combine: true }) : null;
  
      if (ranges === -1) {
        // Invalid range
        res.status(416).send('Requested Range Not Satisfiable');
        return;
      }
  
      // Use the first range (if any)
      const rangeFirst = ranges ? ranges[0] : null;
  
      res.status(206)
        .header({
          'Content-Range': `bytes ${rangeFirst.start || 0}-${rangeFirst.end || fileSize - 1}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': rangeFirst ? rangeFirst.end - rangeFirst.start + 1 : fileSize,
          'Content-Type': 'video/mp4',
        });
  
      const encryptedStream = fs.createReadStream(filePath, { start: rangeFirst ? rangeFirst.start : 0, end: rangeFirst ? rangeFirst.end : fileSize - 1 });
      
      // Pipe the encrypted stream through the decipher stream and then to the response
      encryptedStream.pipe(decipher).pipe(res);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
});

export { decryptRouter };