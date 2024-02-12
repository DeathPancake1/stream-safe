export default async function encryptAES(keyHex: string, filePath: string, user1Email: string, user2Email: string, fileName: string, apiUrl: string, apiKey: string, jwt: string, type:string) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.encryptSymmetricAES(keyHex, filePath, user1Email, user2Email, fileName, apiUrl, apiKey, jwt, type);
    return encryptedFile
}