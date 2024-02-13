export default async function writeFile(user1Email: string, user2Email: string, fileName: string, jwt: string, url: string, apiKey: string, path: string) {
    //@ts-ignore
    const status = await window.electron.fileSystem.writeFile(user1Email, user2Email, fileName, jwt, url, apiKey, path);
    return status
}
