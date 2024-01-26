export default async function encryptPublic(publicKey: string, plaintext: string) {
    //@ts-ignore
    const cipherText = await window.electron.crypto.encryptPublicRSA(publicKey, plaintext);
    return cipherText
}
