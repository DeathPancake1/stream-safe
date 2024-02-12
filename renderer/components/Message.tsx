import { Box, Button, Typography } from "@mui/material";
import { Video, keysDB, updateVideo } from "../indexedDB";
import DownloadIcon from '@mui/icons-material/Download';
import { useUser } from "../providers/UserContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MouseEventHandler, useState } from "react";
import decryptAES from "../helpers/decryption/decryptAES";
import { useLiveQuery } from "dexie-react-hooks";
import { useDownloadFile } from "../api/hooks/download-file-hook";
import writeFile from "../helpers/fileSystem/writeFile";
import setKeys from "../helpers/express/setKeys";
import { localUrl } from "../config";

interface Props {
    incoming: boolean;
    message: Video;
    messages: Video[];
    setPlayVideo: (boolean)=>void;
    setVideo: (videoUrl: string)=>void;
    setMessages: (videos: Video[])=>void
}

export default function Message({ incoming, message, messages, setPlayVideo, setVideo, setMessages}: Props) {
  const {userData, updateUser} = useUser()
  const {mutate: downloadFile} = useDownloadFile()
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const backgroundColor = incoming ? '#e0e0e0' : '#333333'; // Adjust colors as needed
  const textColor = incoming ? '#333' : '#fff'; // Adjust text color for better contrast

  const fetchedKey = useLiveQuery(
    async()=>{
      const email = incoming? message.sender : message.receiver
      const key = await keysDB.keys
        .where('name')
        .equals(email)
        .first();
      return key;
    }
  );

  const markMessageDownloaded = ()=>{
    const updatedMessages = [...messages];
    const messageIndex = updatedMessages.findIndex((msg) => msg.id === message.id);
    if (messageIndex !== -1) {
      // Update the downloaded property of the specific message
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        downloaded: true,
      };

      // Use setMessages to update the state with the modified array
      setMessages(updatedMessages);
    }

    // Update the message in IndexedDB
    updateVideo(message.id, { ...message, downloaded: true });
  }

  const download = async ()=>{
    await downloadFile({
      jwt: userData.jwt,
      path: message.path,
      setDownloadProgress
      },
      {
        onSuccess: async (response)=>{
          const email = incoming? message.sender : message.receiver
          const status = await writeFile(userData.email, email, message.name, response.data)
          if(status){
            markMessageDownloaded()
          }
        }
      }
    )
  }

  const playVideo = async ()=>{
    const email = incoming? message.sender : message.receiver
    setKeys(fetchedKey.value, message.iv)
    const base_url = localUrl;
    setVideo(base_url+'/decrypt/'+userData.email+'/'+email+'/'+message.name)
    setPlayVideo(true)
  }

  return (
    <Box
      sx={{
        width: 'fit-content',
        minWidth: '10%',
        maxWidth: '40%',
        height: 'fit-content',
        backgroundColor: backgroundColor,
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginLeft: incoming ? 'initial' : 'auto',
        padding: '10px',
        color: textColor,
        fontWeight: 'bold',
        marginTop: '10px',
        display: "flex",
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          margin: '2px',
          textAlign: 'center',
          overflowX: 'hidden'
        }}
      >
        <Typography fontFamily={'roboto'} fontSize={24} >
          {message.name.slice(0, -4)}
        </Typography>
      </Box>
      <Box>
        {
          message.downloaded?
          <Button 
            component="label" 
            color="secondary"
            variant="text" 
            startIcon={<PlayArrowIcon />} 
            onClick={()=>{
              playVideo()
            }} 
            fullWidth
          >
            Play Video
          </Button>
          :
          <Button
            component="label" 
            variant="text" 
            startIcon={<DownloadIcon />} 
            onClick={()=>download()} 
            fullWidth
          >
            Download file
          </Button>
        }
        
      </Box>
    </Box>
  );
}
