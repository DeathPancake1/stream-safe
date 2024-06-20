import Dexie, { Table } from 'dexie';
import secureLocalStorage from 'react-secure-storage';
import encryptAESHex from '../helpers/encryption/encryptAESHex';
import ChannelType from '../types/channel-type';

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
  try {
    const masterKey = secureLocalStorage.getItem('masterKey').toString();
    const encryptedKey = await encryptAESHex(masterKey, channelKey);

    // Check if the channel already exists by channelId
    const existingChannel = await channelsDB.channels
      .where('channelId')
      .equalsIgnoreCase(channelId)
      .first();

    if (existingChannel) {
      // Update the existing channel's key
      await channelsDB.channels.update(existingChannel.id, { channelKey: encryptedKey });
      return existingChannel.id;
    } else {
      // Add a new channel if it doesn't exist
      const id = await channelsDB.channels.add({
        name,
        channelId,
        channelKey: encryptedKey,
        ownerEmail,
        userEmail
      });
      return id;
    }

  } catch (error) {
    console.error(error);
  }
}
