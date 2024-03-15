import { addKey, Keys, keysDB } from "./keys.db";
import { addChannel, Channels, channelsDB } from "./channel.db";
import { addVideo, updateVideo, Video, videosDB } from "./videos.db";
import { addChannelVideo, updateChannelVideo, ChannelVideo, channelVideosDB } from "./channelVideos.db";
export { addKey, addVideo, updateVideo, keysDB, videosDB, addChannelVideo, updateChannelVideo, channelVideosDB, addChannel };
export type { Keys, Video, Channels, channelsDB, ChannelVideo };
