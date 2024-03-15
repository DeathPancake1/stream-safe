import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../providers/UserContext";
import { ChannelVideo, Video, addChannelVideo, addKey, channelVideosDB, videosDB } from "../../indexedDB";
import { useLiveQuery } from "dexie-react-hooks";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";
import ChannelType from "../../types/channel-type";
import ChannelMessage from "../../components/ChannelMessage";
import { useGetMessagesFromChannel } from "../../api/hooks/channel-hook";

interface Props {
  channel: ChannelType;
}

export default function ChannelBody({ channel }: Props) {
  const {userData, updateUser} = useUser()
  const [ videoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);
  const {mutate: getMessages} = useGetMessagesFromChannel()
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('')
  const [forceUpdate, setForceUpdate] = useState(false);
  const [ allMessages, setAllMessages ] = useState<ChannelVideo[]>([])
  const [messages, setMessages] = useState<ChannelVideo[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useLiveQuery(
    async () => {
      const messages = await channelVideosDB.videos
        .where('channelId')
        .equalsIgnoreCase(channel.channelId)
        .sortBy('date');
  
        setMessages(messages)
    },
    [forceUpdate, channel]
  );  

  const processNewMessages = (response) => {
    const newMessages = response.data;
    if(newMessages){
        newMessages.forEach(async (message) => {
            // Check if the message already exists in the database
            const existingMessage = allMessages.find(
              (existingMsg) =>
                existingMsg.name === message.name &&
                existingMsg.type === message.type &&
                existingMsg.iv === message.iv
            );
        
            // If the message doesn't exist, add it to the database
            if (!existingMessage) {
              const date = Date.parse(message.sentDate);
              const id = addChannelVideo(
                message.path,
                message.name,
                channel.channelId,
                date,
                false,
                message.iv,
                message.type
              );
            }
        });
    }
  };
  

  useEffect(()=>{
    const sortedMessages = [...messages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setAllMessages(sortedMessages);
  }, [messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    const intervalId = setInterval(() => {
        getMessages({ jwt: userData.jwt, channelId: channel.channelId }, { onSuccess: processNewMessages });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [allMessages]);

  useEffect(()=>{
    setForceUpdate((prev) => !prev);
  }, [channel])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VideoPlayer 
        visible={videoPlayerVisible} 
        videoUrl={selectedVideoUrl} 
        setVideoUrl={setSelectedVideoUrl} 
        setVisible={setVideoPlayerVisible} 
      />
      {
        allMessages?.map((message, index) =>
          <ChannelMessage 
            key={index} 
            message={message} 
            messages={allMessages}
            setMessages={setAllMessages}
            incoming={channel.ownerEmail!==userData.email} 
            setPlayVideo={setVideoPlayerVisible} 
            setVideo={setSelectedVideoUrl}
            channel={channel}
          />
        )
      }
      <div ref={messagesEndRef} />
    </Box>
  );
}
