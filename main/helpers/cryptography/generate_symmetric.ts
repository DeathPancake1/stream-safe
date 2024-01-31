import crypto from 'crypto'

export default async function generateSymmetric (event, keyLen)  {
    // Implement the actual symmetric key generation using crypto module
    const keyBuffer = crypto.randomBytes(keyLen);
    const keyHex = keyBuffer.toString('hex');
    return keyHex;
}