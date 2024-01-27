import path from 'path'
import { app, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import crypto from 'crypto'
import fs from 'fs'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

ipcMain.handle('generate-key-pair', async (event, type, options) => {
  // Implement the actual key pair generation using crypto module
  const { publicKey, privateKey } = crypto.generateKeyPairSync(type, options);
  return { publicKey, privateKey };
});

ipcMain.handle('generate-symmetric-256', async (event, keyLen) => {
  // Implement the actual symmetric key generation using crypto module
  const keyBuffer = crypto.randomBytes(keyLen);
  const keyHex = keyBuffer.toString('hex');
  return keyHex;
});

ipcMain.handle('encrypt-public-RSA', async (event, publicKey, plaintext) => {
  // Encrypt using public key in crypto
  const buffer = Buffer.from(plaintext);
  const publicKeyBuffer = Buffer.from(publicKey);
  const encrypted = crypto.publicEncrypt({ key: publicKeyBuffer, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer);
  return encrypted.toString('base64');
});

ipcMain.handle('decrypt-private-RSA', async (event, privateKey, cipherText) => {
  // Decrypt using private key in crypto
  const privateKeyBuffer = Buffer.from(privateKey);

  // Convert the base64-encoded cipher text to a Buffer
  const buffer = Buffer.from(cipherText, 'base64');

  // Decrypt using private key in crypto
  const decrypted = crypto.privateDecrypt(
    { key: privateKeyBuffer, padding: crypto.constants.RSA_PKCS1_PADDING },
    buffer
  );

  // Return the decrypted data as a UTF-8 string
  return decrypted.toString('utf-8');
});

ipcMain.handle('encrypt-symmetric-AES', async (event, keyHex, arrayBuffer) => {
  try {
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);

    // Convert keyHex to Buffer
    const keyBuffer = Buffer.from(keyHex, 'hex');

    // Generate IV
    const iv = crypto.randomBytes(16);

    // Create a cipher with AES-256-CBC algorithm
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);

    // Encrypt the data
    const encryptedBuffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const resultBuffer = Buffer.concat([iv, encryptedBuffer]);

    // Return the base64-encoded result
    return resultBuffer.toString('base64');
  } catch (error) {
    console.error('Symmetric encryption failed:', error.message);
    return null;
  }
});


;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Disables screen recording and screenshots
  //mainWindow.setContentProtection(true);

  const menu = Menu.buildFromTemplate([]);
  mainWindow.setMenu(menu);

  if (isProd) {
    await mainWindow.loadURL('app://./login')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/login`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
