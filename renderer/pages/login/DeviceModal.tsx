'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import { useCheckLocked } from "../../api/hooks/device-hook";

interface props{
    open: boolean
    setOpen: (value: boolean)=>void
}



export default function DeviceModal({open, setOpen}: props){
    const jwt = secureLocalStorage.getItem('jwt')
    const { data: locked, isLoading, isError } = useCheckLocked(jwt.toString());
    console.log(locked, isLoading, isError)
    
    

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Do you want to lock the account to this device?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You will not be able to change the device for 30 days.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleClose} autoFocus>
                Agree
            </Button>
            </DialogActions>
        </Dialog>
    )
}