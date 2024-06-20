import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../providers/UserContext";
import {
    ChannelVideo,
    Video,
    addChannelVideo,
    addKey,
    channelVideosDB,
    videosDB,
} from "../../indexedDB";
import { useLiveQuery } from "dexie-react-hooks";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import ChannelType from "../../types/channel-type";
import ChannelMessage from "../../components/ChannelMessage";
import { useGetMessagesFromChannel } from "../../api/hooks/channel-hook";

interface Props {
    channel: ChannelType;
}

export default function ChannelBody({ channel }: Props) {
    const { userData, updateUser } = useUser();
    const [videoPlayerVisible, setVideoPlayerVisible] =
        useState<boolean>(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
    const [allMessages, setAllMessages] = useState<ChannelVideo[]>([]);
    const [messages, setMessages] = useState<ChannelVideo[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useLiveQuery(async () => {
        const dbMessages = await channelVideosDB.videos
            .where("channelId")
            .equalsIgnoreCase(channel.channelId)
            .sortBy("date");

        setMessages(dbMessages);
    }, [channel]);

    useEffect(() => {
        const sortedMessages = [...messages].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAllMessages(sortedMessages);
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [allMessages]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <VideoPlayer
                visible={videoPlayerVisible}
                videoUrl={selectedVideoUrl}
                setVideoUrl={setSelectedVideoUrl}
                setVisible={setVideoPlayerVisible}
            />
            {allMessages?.map((message, index) => (
                <ChannelMessage
                    key={index}
                    message={message}
                    messages={allMessages}
                    setMessages={setAllMessages}
                    incoming={channel.ownerEmail !== userData.email}
                    setPlayVideo={setVideoPlayerVisible}
                    setVideo={setSelectedVideoUrl}
                    channel={channel}
                />
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
}