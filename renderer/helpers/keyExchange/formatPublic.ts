export default function formatPublicKey(oneLineKey) {
    const keyHeader = "-----BEGIN PUBLIC KEY-----";
    const keyFooter = "-----END PUBLIC KEY-----";
    let keyBody = oneLineKey.replace(keyHeader, '').replace(keyFooter, '').trim();

    let result = keyHeader;
    while (keyBody.length > 0) {
        if (keyBody.length > 64) {
            result += "\n" + keyBody.substring(0, 64);
            keyBody = keyBody.substring(64);
        } else {
            result += "\n" + keyBody;
            keyBody = "";
        }
    }
    result += "\n" + keyFooter;
    return result;
}