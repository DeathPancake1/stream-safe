export default async function encryptAESChannel(keyHex: string, filePath: string, channelId: string, fileName: string, apiUrl: string, apiKey: string, jwt: string, type:string) {
    //@ts-ignore
    const encryptedFile = await window.electron.crypto.encryptSymmetricAESChannel(keyHex, filePath, channelId, fileName, apiUrl, apiKey, jwt, type);
    return encryptedFile
}