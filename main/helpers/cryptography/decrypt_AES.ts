import crypto from 'crypto'
import { Readable } from 'stream';

export default async function handleDecryptSymmetricAES (event, keyHex, encryptedBase64) {
    try {
      // Convert the base64-encoded string to a Buffer
      const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
  
      // Extract the IV and the encrypted data
      const iv = encryptedBuffer.slice(0, 16);
      const data = encryptedBuffer.slice(16);
  
      // Convert keyHex to Buffer
      const keyBuffer = Buffer.from(keyHex, 'hex');
  
      // Create a decipher with AES-256-CBC algorithm
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
  
      // Convert the data to a stream
      const dataStream = new Readable();
      dataStream.push(data);
      dataStream.push(null);
  
      // Pipe the data stream into the decipher
      const decryptedBuffer = [];
      dataStream.pipe(decipher).on('data', chunk => decryptedBuffer.push(chunk));
  
      // Wait for the stream to end
      await new Promise(resolve => decipher.on('end', resolve));
  
      // Return the decrypted data
      return Buffer.concat(decryptedBuffer);
    } catch (error) {
      console.error('Symmetric decryption failed:', error.message);
      return null;
    }
}