import * as crypto from 'crypto'

export default async function generateAsymmetricKeys() {
    const { publicKey, privateKey } = await crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
    });
    return { publicKey, privateKey }
}