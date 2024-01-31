import Dexie, { Table } from 'dexie';

export interface Video {
    id?: number;
    path: string;
    name: string; 
    sender: string; 
    receiver: string;
    date: Date;
    downloaded: boolean;
}

class VideoDatabase extends Dexie {
  videos!: Table<Video>;

  constructor() {
    super('videosDatabase');
    this.version(1).stores({
      videos: '++id, path, name, sender, receiver, date, downloaded'
    });
  }
}

export const videosDB = new VideoDatabase();

export async function addVideo(path, name, sender, receiver, date, downloaded) {
    try{
        const id = await videosDB.videos.add({
            path,
            name,
            sender,
            receiver,
            date,
            downloaded
        });

        return id;

    }catch(error){

        console.error(error)

    }
}