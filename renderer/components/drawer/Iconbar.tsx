import { Box, Fab, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ChatType from "../../types/chat-type";
import RefreshButton from "./RefreshButton";


interface Props{
    chats: ChatType[]
    setChats: (chats: ChatType[])=>void
}

export default function Iconbar(){

  return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '10px',
            boxShadow: 'none'
          }}
        >
          <Tooltip title="Unlock Account">
            <Fab 
              size="small" 
              color="secondary" 
              aria-label="unlock"
              sx={{
                boxShadow: 'none'
              }}
            >
              <LockOpenIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Refresh messages">
            <RefreshButton />
          </Tooltip>
          <Tooltip title="Start new chat">
            <Fab
              size="small" 
              color="secondary" 
              aria-label="add"
              sx={{
                boxShadow: 'none'
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>
  )
}