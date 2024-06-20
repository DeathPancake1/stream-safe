import Dexie, { Table } from "dexie";
import { channelsDB } from "./channel.db"; // Import the channelsDB

export interface ChannelVideo {
    id?: number;
    path: string;
    name: string;
    channelId: string;
    date: Date;
    downloaded: boolean;
    iv: string;
    type: string;
    key: string;
}

class ChannelVideoDatabase extends Dexie {
    videos!: Table<ChannelVideo>;

    constructor() {
        super("channelVideosDatabase");
        this.version(1).stores({
            videos: "++id, path, name, channelId, date, downloaded, iv, type, key",
        });
    }
}

export const channelVideosDB = new ChannelVideoDatabase();

export async function addChannelVideo(
    path,
    name,
    channelId,
    date,
    downloaded,
    iv,
    type,
    key
) {
    const id = await channelVideosDB.videos.add({
        path,
        name,
        channelId,
        date,
        downloaded,
        iv,
        type,
        key, 
    });

    return id;
}

export async function updateChannelVideo(
    videoId: number,
    updatedData: ChannelVideo
) {
    try {
        await channelVideosDB.videos.update(videoId, updatedData);
    } catch (error) {
        console.error(error);
    }
}
