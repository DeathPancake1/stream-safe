import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../providers/UserContext";
import {
    ChannelVideo,
    addChannelVideo,
    channelVideosDB,
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
    const { userData } = useUser();
    const [videoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);
    const { mutate: getMessages } = useGetMessagesFromChannel();
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
    const [allMessages, setAllMessages] = useState<ChannelVideo[]>([]);
    const [messages, setMessages] = useState<ChannelVideo[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMessagesUpdated, setIsMessagesUpdated] = useState(false);

    useLiveQuery(async () => {
        const dbMessages = await channelVideosDB.videos
            .where("channelId")
            .equalsIgnoreCase(channel.channelId)
            .sortBy("date");

        setMessages(dbMessages);
        setIsMessagesUpdated(true);
    }, [channel]);

    const processNewMessages = async (response) => {
        const newMessages = response.data;
        console.log(newMessages, messages)
        if (newMessages) {
            for (const message of newMessages) {
                // Wait until messages state is updated
                while (!isMessagesUpdated) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Check if the message already exists in the database
                const existingMessage = messages.find((existingMsg) => {
                    return (
                        existingMsg.name === message.name &&
                        existingMsg.type === message.type &&
                        existingMsg.iv === message.iv
                    );
                });

                // If the message doesn't exist, add it to the database
                if (!existingMessage) {
                    const date = Date.parse(message.sentDate);
                    await addChannelVideo(
                        message.path,
                        message.name,
                        channel.channelId,
                        date,
                        false,
                        message.iv,
                        message.type
                    );
                }
            }
        }
    };

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

    useEffect(() => {
        getMessages(
            { jwt: userData.jwt, channelId: channel.channelId },
            { onSuccess: processNewMessages }
        );

        const intervalId = setInterval(() => {
            getMessages(
                { jwt: userData.jwt, channelId: channel.channelId },
                { onSuccess: processNewMessages }
            );
        }, 20000);

        return () => clearInterval(intervalId);
    }, [channel]);

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
