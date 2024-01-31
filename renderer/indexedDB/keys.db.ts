import Dexie, { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

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
        const id = await keysDB.keys.add({
            name,
            value
        });

        return id;

    }catch(error){

        console.error(error)

    }
}