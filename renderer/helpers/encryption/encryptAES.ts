export default async function encryptAES(keyHex: string, fileData: ArrayBuffer) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.encryptSymmetricAES(keyHex, fileData);
    return encryptedFile
}