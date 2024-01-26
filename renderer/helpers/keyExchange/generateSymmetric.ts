export default async function generateSymmetricKey256() {
    //@ts-ignore
    const keyHex = await window.electron.crypto.generateRandomKey(32);
    return keyHex
}
