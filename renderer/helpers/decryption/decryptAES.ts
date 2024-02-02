export default async function decryptAES(keyHex: string, iv: string, user1Email: string, user2Email: string, fileName: string) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.decryptSymmetricAES(keyHex, iv, user1Email, user2Email, fileName);
    return encryptedFile
}