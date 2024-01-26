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
  },
});

contextBridge.exposeInMainWorld('ipc', handler)

contextBridge.exposeInMainWorld('envVars', {
  apiKey: process.env.API_KEY
});

export type IpcHandler = typeof handler
