import { Box } from "@mui/material";
import ChatType from "../../types/chat-type";
import { useEffect, useRef, useState } from "react";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";
import { useCheckConversationKey, useExchangeSymmetric } from "../../api/hooks/key-hook";
import { useUser } from "../../providers/UserContext";
import { Video, addKey, videosDB } from "../../indexedDB";
import Message from "../../components/Message";
import { useLiveQuery } from "dexie-react-hooks";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";

interface Props {
  chat: ChatType;
}

export default function ChatBody({ chat }: Props) {
  const { mutate: checkConversationKey } = useCheckConversationKey();
  const { mutate: exchangeSymmetric } = useExchangeSymmetric();
  const {userData, updateUser} = useUser()
  const [ videoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [forceUpdate, setForceUpdate] = useState(false);
  const [ allMessages, setAllMessages ] = useState<Video[]>([])
  const [sentMessages, setSentMessages] = useState<Video[]>([])
  const [receivedMessages, setReceivedMessages] = useState<Video[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useLiveQuery(
    async () => {
      const sentMessages = await videosDB.videos
        .where('sender')
        .equalsIgnoreCase(userData.email)
        .and((video) => video.receiver === chat.email)
        .sortBy('date');
  
      setSentMessages(sentMessages)
    },
    [forceUpdate, chat]
  );  

  useLiveQuery(
    async () => {
      const receivedMessages = await videosDB.videos
        .where('receiver')
        .equalsIgnoreCase(userData.email)
        .and((video) => video.sender === chat.email)
        .sortBy('date');
  
      setReceivedMessages(receivedMessages)
    },
    [forceUpdate, chat]
  );

  const generateConversationKey = async () => {
    const keyHex = await generateSymmetricKey256();
    return keyHex;
  };

  const encryptAndSendSymmetricKey = async (key: string) => {
    const cipherText = await encryptPublic(chat.publicKey, key);
    await exchangeSymmetric(
      { email: chat.email, key: cipherText, jwt: userData.jwt },
      {
        onSuccess: (response) => {

        },
      }
    );
  };

  const handleNewKey = async (keyExists: boolean)=>{
    if(!keyExists){
      const key = await generateConversationKey()
      const id = await addKey(chat.email, key)
      await encryptAndSendSymmetricKey(key)
    }
  }

  useEffect(()=>{
    const unsortedMessages = receivedMessages.concat(sentMessages);
    const sortedMessages = [...unsortedMessages].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setAllMessages(sortedMessages);
  }, [receivedMessages, sentMessages])

  useEffect(() => {
    // Check the server if there is a conversation key already
    if (userData.jwt) {
      checkConversationKey(
        { email: chat.email, jwt: userData.jwt },
        {
          onSuccess: (response) => {
            handleNewKey(response.data)
          },
        }
      );
    }
    setForceUpdate((prev) => !prev);
  }, [chat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VideoPlayer 
        visible={videoPlayerVisible} 
        video={selectedVideo} 
        setVideo={setSelectedVideo} 
        setVisible={setVideoPlayerVisible} 
      />
      {
        allMessages?.map((message, index) =>
          <Message 
            key={index} 
            message={message} 
            incoming={message.receiver===userData.email} 
            setPlayVideo={setVideoPlayerVisible} 
            setVideo={setSelectedVideo}
          />
        )
      }
      <div ref={messagesEndRef} />
    </Box>
  );
}
