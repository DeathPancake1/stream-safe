import path from 'path'
import { app, ipcMain, Menu } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import crypto from 'crypto'

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
  mainWindow.setContentProtection(true);

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
