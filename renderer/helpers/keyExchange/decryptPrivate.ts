export default async function decryptPrivate(privateKey: string, cipherText: string) {
    //@ts-ignore
    const plaintext = await window.electron.crypto.decryptPrivateRSA(privateKey, cipherText);
    return plaintext
}
