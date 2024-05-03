import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";

export const renderDialogContent = (state: number, login, handleClose, lockThisDevice) => {
    const router = useRouter()
    
    switch (state) {
        case 0:
            router.push('/home')
        case 1:
            return (
                <>
                    <DialogTitle id="alert-dialog-title">
                        {"Your account is locked to another device"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please unlock your account from that device before signing in
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Sign out</Button>
                    </DialogActions>
                </>
            );
        case 2:
            return (
                <>
                    <DialogTitle id="alert-dialog-title">
                        {"Your device is locked to another account"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please unlock your device before signing in
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>I understand</Button>
                    </DialogActions>
                </>
            );
        case 3:
            return (
            <>
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
                    <Button onClick={lockThisDevice} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </>
            );
        default:
            return "Default content";
    }
};