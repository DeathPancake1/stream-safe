import { Box, Button, Typography } from "@mui/material";
import { Video, keysDB } from "../indexedDB";
import DownloadIcon from '@mui/icons-material/Download';
import { useUser } from "../providers/UserContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { MouseEventHandler } from "react";
import decryptAES from "../helpers/decryption/decryptAES";
import { useLiveQuery } from "dexie-react-hooks";

interface Props {
    incoming: boolean;
    message: Video;
    setPlayVideo: (boolean)=>void;
    setVideo: (Video)=>void;
}

export default function Message({ incoming, message, setPlayVideo, setVideo }: Props) {
  const {userData, updateUser} = useUser()
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

  const download = async ()=>{

  }

  const playVideo = async ()=>{
    const email = incoming? message.sender : message.receiver
    const decryptedContent:Buffer = await decryptAES(fetchedKey.value, message.iv, userData.email, email, message.name)
    const decryptedBlob = new Blob([decryptedContent], { type: message.type });
    const decryptedFile = new File([decryptedBlob], message.name, { type: message.type });
    setVideo(decryptedFile)
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
