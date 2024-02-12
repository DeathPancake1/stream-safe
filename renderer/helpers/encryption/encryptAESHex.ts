export default async function encryptAESHex(keyHex: string, plaintext: string) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.encryptSymmetricAESHex(keyHex, plaintext);
    return encryptedFile
}