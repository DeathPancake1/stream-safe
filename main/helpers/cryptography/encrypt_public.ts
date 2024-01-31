import crypto from 'crypto'

export default async function encryptPublic (event, publicKey, plaintext) {
    // Encrypt using public key in crypto
    const buffer = Buffer.from(plaintext);
    const publicKeyBuffer = Buffer.from(publicKey);
    const encrypted = crypto.publicEncrypt({ key: publicKeyBuffer, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer);
    return encrypted.toString('base64');
}