import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Tooltip } from "@mui/material";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RefreshButton from "./RefreshButton";
import AddButton from "./AddButton";
import secureLocalStorage from "react-secure-storage";
import { useUser } from "../../providers/UserContext";
import router from "next/router";
import login from "../../pages/login";
import { useState } from "react";

export default function Iconbar(){
  const {userData, updateUser} = useUser()
  const [openUnlockAccount, setOpenUnlockAccount] = useState<boolean>(false)

  const handleUnlockAndLogOut = (event): void => {
    secureLocalStorage.clear()
    localStorage.clear()
    updateUser('', '')
    router.push('/login')
  }

  const openUnlockModal = (event) : void=>{
    setOpenUnlockAccount(true)
  }

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
          <Dialog open={openUnlockAccount}>
            <DialogTitle id="alert-dialog-title">
              {"Unlocking your device"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Are you sure you want to unlock your device?
                  You can't undo this and your account will still be locked for <b>30 days</b> from the last time you locked it.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpenUnlockAccount(false)}>No</Button>
                <Button variant="contained" onClick={handleUnlockAndLogOut}>Yes</Button>
            </DialogActions>
          </Dialog>
          <Tooltip title="Unlock Device">
            <Fab 
              size="small" 
              color="secondary" 
              aria-label="unlock"
              sx={{
                boxShadow: 'none'
              }}
              onClick={openUnlockModal}
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