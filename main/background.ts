import path from 'path'
import { app, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { 
  decryptPrivate, 
  encryptPublic, 
  generateKeyPair, 
  generateSymmetric, 
  handleDecryptSymmetricAESHex, 
  handleEncryptSymmetricAES, 
  handleEncryptSymmetricAESHex 
} from './helpers/cryptography'
import { writeFile } from './helpers/files'
import express from 'express'
import { decryptRouter, setKeys } from './helpers/expressEndPoints/decryptEndPoint'
import morgan from 'morgan'
import https from 'https'
import { certificate, privateKey } from './config'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const expressApp = express();
const port = 3171;

expressApp.use(decryptRouter);



const startExpressServer = () => {
  server.listen(port, () => {
    console.log(`App listening on https://localhost:${port}`);
  });
};

ipcMain.handle('generate-key-pair', generateKeyPair);
ipcMain.handle('generate-symmetric-256', generateSymmetric);
ipcMain.handle('encrypt-public-RSA', encryptPublic);
ipcMain.handle('decrypt-private-RSA', decryptPrivate);
ipcMain.handle('encrypt-symmetric-AES', handleEncryptSymmetricAES);
ipcMain.handle('decrypt-symmetric-AES-hex', handleDecryptSymmetricAESHex);
ipcMain.handle('encrypt-symmetric-AES-hex', handleEncryptSymmetricAESHex);
ipcMain.handle('set-keys', setKeys);
ipcMain.handle('write-file', writeFile)

expressApp.use(morgan("dev"));

const options = {
  key: privateKey,
  cert: certificate,
};

// Create HTTPS server
const server = https.createServer(options, expressApp);


;(async () => {
  await app.whenReady()
  startExpressServer()
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

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error if https://localhost:3171 we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  if (url.startsWith(`https://localhost:${port}`)) {
    // On certificate error, disable default behavior (stop loading the page)
    // and then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
  } else {
    // Do nothing for other URLs
    callback(false);
  }
});

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
