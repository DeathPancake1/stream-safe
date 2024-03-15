import Dexie, { Table } from 'dexie';

export interface ChannelVideo {
    id?: number;
    path: string;
    name: string; 
    channelId: string; 
    date: Date;
    downloaded: boolean;
    iv: string;
    type: string
}

class ChannelVideoDatabase extends Dexie {
  videos!: Table<ChannelVideo>;

  constructor() {
    super('channelVideosDatabase');
    this.version(1).stores({
      videos: '++id, path, name, channelId, date, downloaded, iv, type'
    });
  }
}

export const channelVideosDB = new ChannelVideoDatabase();

export async function addChannelVideo(path, name, channelId, date, downloaded, iv, type) {
    try{
        const id = await channelVideosDB.videos.add({
            path,
            name,
            channelId,
            date,
            downloaded,
            iv,
            type
        });

        return id;

    }catch(error){

        console.error(error)

    }
}

export async function updateChannelVideo(videoId: number, updatedData: ChannelVideo){
  try {
    await channelVideosDB.videos.update(videoId, updatedData);
  } catch (error) {
    console.error(error)
  }
}