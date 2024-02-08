import path, { resolve } from 'path'
import { app, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { decryptPrivate, encryptPublic, generateKeyPair, generateSymmetric, handleDecryptSymmetricAES, handleEncryptSymmetricAES } from './helpers/cryptography'
import { writeFile } from './helpers/files'
import express from 'express'
import fs from 'fs'
import range from 'range-parser';
import crypto from 'crypto'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const expressApp = express();
const port = 3171;

expressApp.get('/decrypt/:user1Email/:user2Email/:fileName', async (req, res) => {
  const { user1Email, user2Email, fileName } = req.params;
  const { keyHex, ivHex } = req.query;

  try {
    const appDataPath = app.getPath('appData');
    const appName = 'stream-safe';
    const streamSafePath = path.join(appDataPath, appName);

    const keyBuffer = Buffer.from(keyHex, 'hex');
    const ivBuffer = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
    decipher.setAutoPadding(false); 

    const filePath = path.join(streamSafePath, 'videos', user1Email + '_' + user2Email, fileName);

    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Parse range headers
    const rangeHeader = req.headers.range;
    const ranges = rangeHeader ? range(fileSize, rangeHeader, { combine: true }) : null;

    if (ranges === -1) {
      // Invalid range
      res.status(416).send('Requested Range Not Satisfiable');
      return;
    }

    // Use the first range (if any)
    const rangeFirst = ranges ? ranges[0] : null;

    res.status(206)
      .header({
        'Content-Range': `bytes ${rangeFirst.start || 0}-${rangeFirst.end || fileSize - 1}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': rangeFirst ? rangeFirst.end - rangeFirst.start + 1 : fileSize,
        'Content-Type': 'video/mp4',
      });

    const encryptedStream = fs.createReadStream(filePath, { start: rangeFirst ? rangeFirst.start : 0, end: rangeFirst ? rangeFirst.end : fileSize - 1 });
    
    // Pipe the encrypted stream through the decipher stream and then to the response
    encryptedStream.pipe(decipher).pipe(res);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

const startExpressServer = () => {
  expressApp.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
  });
};

ipcMain.handle('generate-key-pair', generateKeyPair);
ipcMain.handle('generate-symmetric-256', generateSymmetric);
ipcMain.handle('encrypt-public-RSA', encryptPublic);
ipcMain.handle('decrypt-private-RSA', decryptPrivate);
ipcMain.handle('encrypt-symmetric-AES', handleEncryptSymmetricAES);
ipcMain.handle('decrypt-symmetric-AES', handleDecryptSymmetricAES);

ipcMain.handle('write-file', writeFile)


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

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
