import Dexie, { Table } from 'dexie';
import secureLocalStorage from 'react-secure-storage';
import encryptAESHex from '../helpers/encryption/encryptAESHex';

export interface Keys {
    id?: number;
    name: string;
    value: string; 
}

class KeysDatabase extends Dexie {
  keys!: Table<Keys>;

  constructor() {
    super('keysDatabase');
    this.version(1).stores({
      keys: '++id, name, value'
    });
  }
}

export const keysDB = new KeysDatabase();

export async function addKey(name, value) {
  try{
    const masterKey = secureLocalStorage.getItem('masterKey').toString()
    const encryptedKey = await encryptAESHex(masterKey, value)
    const id = await keysDB.keys.add({
        name,
        value: encryptedKey
    });

    return id;

  }catch(error){

    console.error(error)

  }
}