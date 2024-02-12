import crypto from 'crypto'

export default async function encryptAESHex(event, keyHex, plaintext){
    const keyBuffer = Buffer.from(keyHex, 'hex');
    const cipher = crypto.createCipher('aes-256-cbc', keyBuffer);

    // Update the cipher with the plaintext and finalize
    let encryptedBuffer = cipher.update(plaintext, 'utf-8', 'hex');
    encryptedBuffer += cipher.final('hex');

    return encryptedBuffer;
}