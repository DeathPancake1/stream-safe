export default async function setKeys(keyHex: string, ivHex: string) {
    //@ts-ignore
    const status = await window.electron.express.setKeys(keyHex, ivHex);
    return status
}
