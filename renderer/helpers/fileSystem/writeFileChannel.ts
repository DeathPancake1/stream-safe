export default async function writeFileChannel(channelId: string, fileName: string, jwt: string, url: string, apiKey: string, path: string) {
    //@ts-ignore
    const status = await window.electron.fileSystem.writeFileChannel(channelId, fileName, jwt, url, apiKey, path);
    return status
}
