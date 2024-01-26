export default function formatPublicKey(oneLineKey) {
    const header = '-----BEGIN PUBLIC KEY-----';
    const footer = '-----END PUBLIC KEY-----';
    let keyWithoutHeaderFooter = oneLineKey.replace(header, '').replace(footer, '').trim();
    let formattedKey = header + '\n';
    while (keyWithoutHeaderFooter.length > 0) {
        if (keyWithoutHeaderFooter.length > 64) {
            formattedKey += keyWithoutHeaderFooter.substring(0, 64) + '\n';
            keyWithoutHeaderFooter = keyWithoutHeaderFooter.substring(64);
        } else {
            formattedKey += keyWithoutHeaderFooter + '\n';
            keyWithoutHeaderFooter = '';
        }
    }
    formattedKey += footer;
    return formattedKey;
}