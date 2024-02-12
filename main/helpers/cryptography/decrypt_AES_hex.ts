import crypto from 'crypto';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export default async function handleDecryptSymmetricAESHex(event, keyHex, encryptedString) {
  const keyBuffer = Buffer.from(keyHex, 'hex');

    // Create a decipher without an IV
    const decipher = crypto.createDecipher('aes-256-cbc', keyBuffer);

    // Update the decipher with the encrypted string and finalize
    let decryptedBuffer = decipher.update(encryptedString, 'hex', 'utf-8');
    decryptedBuffer += decipher.final('utf-8');

    return decryptedBuffer;
}