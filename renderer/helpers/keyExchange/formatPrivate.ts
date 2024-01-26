export default function formatPrivateKey(oneLineKey) {
    const header = '-----BEGIN PRIVATE KEY-----';
    const footer = '-----END PRIVATE KEY-----';
    let keyWithoutHeaderFooter = oneLineKey.replace(header, '').replace(footer, '').trim();
    let formattedKey = header + '\n';
    keyWithoutHeaderFooter = keyWithoutHeaderFooter.replace(/\n\n/g, '\n');
    formattedKey += keyWithoutHeaderFooter + '\n' + footer;
    return formattedKey;
}
