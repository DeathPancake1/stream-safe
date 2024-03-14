import Dexie, { Table } from 'dexie';
import secureLocalStorage from 'react-secure-storage';
import encryptAESHex from '../helpers/encryption/encryptAESHex';

export interface Channels {
    id?: number;
    name: string;
    channelId: string;
    channelKey: string;
    ownerEmail: string; 
    userEmail: string;
}

class ChannelsDatabase extends Dexie {
  channels!: Table<Channels>;

  constructor() {
    super('channelsDatabase');
    this.version(1).stores({
        channels: '++id, name, channelId, channelKey, ownerEmail, userEmail'
    });
  }
}

export const channelsDB = new ChannelsDatabase();

export async function addChannel(
    name: string, 
    channelId: string, 
    channelKey: string, 
    ownerEmail: string,
    userEmail: string
) {
  try{
    const masterKey = secureLocalStorage.getItem('masterKey').toString()
    const encryptedKey = await encryptAESHex(masterKey, channelKey)
    const id = await channelsDB.channels.add({
        name,
        channelId,
        channelKey: encryptedKey,
        ownerEmail,
        userEmail
    });

    return id;

  }catch(error){

    console.error(error)

  }
}