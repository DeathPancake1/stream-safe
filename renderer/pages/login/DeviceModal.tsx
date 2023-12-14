'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import { useCheckId, useCheckLocked, useGetId } from "../../api/hooks/device-hook";
import { useEffect, useState } from "react";
import generateAsymmetricKeys from "../../helpers/device/generateAsymmetric";

interface props{
    open: boolean
    setOpen: (value: boolean)=>void
}



export default function DeviceModal({open, setOpen}: props){
    const [ jwt, setJwt] = useState<string>('')
    const { mutate: getId } = useGetId()
    const { mutate: checkId } = useCheckId()
    const  {mutate: checkLocked} = useCheckLocked()
    const [state, setState] = useState<0|1|2|3>()
    const [locked, setLocked ]= useState<boolean>(false)
    // 0 means locked to this device
    // 1 means locked to another device
    // 2 means not locked but this device is locked to another account
    // 3 means both device and account are unlocked


    const fetchLocked =async (jwt:string) => {
        await checkLocked(
            {jwt},
            {
                onSuccess: (response)=>{
                    setLocked(response.data)
                }
            }
        )
    }

    const checkAccountId = async (deviceId: string)=>{
        await checkId(
            {deviceId, jwt},
            {
                onSuccess: (response)=>{
                    if(response.data === true){
                        setState(0)
                    }
                    else{
                        setState(1)
                    }
                }
            }
        )
    }

    const lockThisDevice = async ()=>{
        const {publicKey, privateKey} = await generateAsymmetricKeys()
        secureLocalStorage.setItem('privateKey', privateKey)
        let deviceId
        await getId(
            {publicKey, jwt},
            {
                onSuccess: (response)=>{
                    deviceId = response.data
                    secureLocalStorage.setItem('deviceId', deviceId)
                }
            }
        )
        setOpen(false)
    }

    const checkAccountState =async () => {
        if(locked){
            const deviceId = secureLocalStorage.getItem('deviceId')
            if(deviceId){
                // call check device id to check state 0 or 1
                checkAccountId(deviceId.toString())
            }else{
                setState(1)
                // state 1
            }
        }else{
            const deviceId = secureLocalStorage.getItem('deviceId')
            if(deviceId){
                setState(2)
                // state 2
            }else{
                setState(3)
                // state 3
            }
            
        }
    }

    

    const renderDialogContent = () => {
        switch (state) {
            case 0:
                return (
                    <>
                        <DialogTitle id="alert-dialog-title">
                            {"Signed in"}
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </>
                );
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
    

    const handleClose = () => {
        setOpen(false);
    };
    

    useEffect(() => {
        setJwt(secureLocalStorage.getItem('jwt').toString())
    }, []);

    useEffect(()=>{
        if(jwt)
            fetchLocked(jwt)
    }, [jwt])

    useEffect(() => {
        checkAccountState();
    }, [locked]);

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {renderDialogContent()}
        </Dialog>
    )
}