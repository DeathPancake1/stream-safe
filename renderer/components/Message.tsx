import { Box } from "@mui/material";
import { Video } from "../indexedDB";

interface Props {
    incoming: boolean;
    message: Video;
}

export default function Message({ incoming, message }: Props) {
  const backgroundColor = incoming ? '#e0e0e0' : '#333333'; // Adjust colors as needed
  const textColor = incoming ? '#333' : '#fff'; // Adjust text color for better contrast

  return (
    <Box
      sx={{
        width: '40%',
        height: '100px',
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
      <Box>
        {message.name}
      </Box>
      <Box>
        Test
      </Box>
      <Box>
        Test
      </Box>
    </Box>
  );
}
