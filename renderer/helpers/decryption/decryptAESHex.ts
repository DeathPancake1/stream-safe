export default async function decryptAESHex(keyHex: string, encryptedString: string) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.decryptSymmetricAESHex(keyHex, encryptedString);
    return encryptedFile
}