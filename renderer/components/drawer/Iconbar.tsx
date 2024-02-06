import { Box, Fab, Tooltip } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SearchBox from "../SearchBox";
import { useSearchUser } from "../../api/hooks/search-hook";
import { useUser } from "../../providers/UserContext";
import ChatType from "../../types/chat-type";
import { useEffect } from "react";

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
              <Fab size="small" color="secondary" aria-label="unlock">
                <LockOpenIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Refresh messages">
              <Fab size="small" color="secondary" aria-label="refresh">
                <RefreshIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Start new chat">
              <Fab size="small" color="secondary" aria-label="add">
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
    )
}