import { Box, Fab, Tooltip } from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RefreshButton from "./RefreshButton";
import AddButton from "./AddButton";

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
            <AddButton />
          </Tooltip>
        </Box>
      </Box>
  )
}