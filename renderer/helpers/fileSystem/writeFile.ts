export default async function writeFile(user1Email: string, user2Email: string, fileName: string, data: string) {
    //@ts-ignore
    const status = await window.electron.fileSystem.writeFile(user1Email, user2Email, fileName, data);
    return status
}
