import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import * as crypto from 'crypto'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('electron', {
  // Expose only the necessary crypto functionality
  crypto: {
    generateKeyPairSync: (type: string, options: any) => {
      return ipcRenderer.invoke('generate-key-pair', type, options);
    },
    generateRandomKey: (keyLen: string) => {
      return ipcRenderer.invoke('generate-symmetric-256', keyLen);
    },
    encryptPublicRSA: (publicKey: string, plaintext: string) =>{
      return ipcRenderer.invoke('encrypt-public-RSA', publicKey, plaintext);
    },
    decryptPrivateRSA: (privateKey: string, cipherText: string) =>{
      return ipcRenderer.invoke('decrypt-private-RSA', privateKey, cipherText);
    },
    encryptSymmetricAES: (keyHex: string, filePath: string, user1Email: string, user2Email: string, fileName: string, apiUrl: string, apiKey: string, jwt: string, type: string) =>{
      return ipcRenderer.invoke('encrypt-symmetric-AES', keyHex, filePath, user1Email, user2Email, fileName, apiUrl, apiKey, jwt, type);
    },
    decryptSymmetricAESHex: (keyHex: string, encryptedString: string) =>{
      return ipcRenderer.invoke('decrypt-symmetric-AES-hex', keyHex, encryptedString);
    },
    encryptSymmetricAESHex: (keyHex: string, plaintext: string) =>{
      return ipcRenderer.invoke('encrypt-symmetric-AES-hex', keyHex, plaintext);
    },
    encryptSymmetricAESChannel: (keyHex: string, filePath: string, channelId: string, fileName: string, apiUrl: string, apiKey: string, jwt: string, type: string) =>{
      return ipcRenderer.invoke('encrypt-symmetric-AES-channel', keyHex, filePath, channelId, fileName, apiUrl, apiKey, jwt, type);
    }

  },
  fileSystem: {
    writeFile: (user1Email: string, user2Email: string, fileName: string, jwt: string, url: string, apiKey: string, path: string) =>{
      return ipcRenderer.invoke('write-file', user1Email, user2Email, fileName, jwt, url, apiKey, path);
    },
    writeFileChannel: (channelId, fileName: string, jwt: string, url: string, apiKey: string, path: string) =>{
      return ipcRenderer.invoke('write-file-channel', channelId, fileName, jwt, url, apiKey, path);
    }
  }
});

contextBridge.exposeInMainWorld('ipc', handler)

contextBridge.exposeInMainWorld('envVars', {
  apiKey: process.env.API_KEY
});

export type IpcHandler = typeof handler
