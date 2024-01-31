import crypto from 'crypto'

export default async function decryptPrivate (event, privateKey, cipherText) {
    // Decrypt using private key in crypto
    const privateKeyBuffer = Buffer.from(privateKey);
  
    // Convert the base64-encoded cipher text to a Buffer
    const buffer = Buffer.from(cipherText, 'base64');
  
    // Decrypt using private key in crypto
    const decrypted = crypto.privateDecrypt(
      { key: privateKeyBuffer, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer
    );
  
    // Return the decrypted data as a UTF-8 string
    return decrypted.toString('utf-8');
}