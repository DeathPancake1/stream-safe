import { Box, Button, Typography } from "@mui/material";
import { Video } from "../indexedDB";
import DownloadIcon from '@mui/icons-material/Download';
import { useUser } from "../providers/UserContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Props {
    incoming: boolean;
    message: Video;
}

export default function Message({ incoming, message }: Props) {
  const {userData, updateUser} = useUser()
  const backgroundColor = incoming ? '#e0e0e0' : '#333333'; // Adjust colors as needed
  const textColor = incoming ? '#333' : '#fff'; // Adjust text color for better contrast

  const download = async ()=>{

  }

  const playVideo = async()=>{

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
        marginRight: "20px",
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
            onClick={()=>console.log('not implemented')} 
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
