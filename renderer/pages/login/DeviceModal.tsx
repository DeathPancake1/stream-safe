'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import { useCheckId, useCheckLocked, useGetId } from "../../api/hooks/device-hook";
import { useEffect, useState } from "react";
import generateAsymmetricKeys from "../../helpers/device/generateAsymmetric";
import { useRouter } from "next/router";
import { useUser } from "../../providers/UserContext";

interface props{
    open: boolean
    setOpen: (value: boolean)=>void
}



export default function DeviceModal({open, setOpen}: props){
    const { mutate: getId } = useGetId()
    const { mutate: checkId } = useCheckId()
    const  {mutate: checkLocked} = useCheckLocked()
    const { userData, updateUser } = useUser();
    const [state, setState] = useState<0|1|2|3>()
    // 0 means locked to this device
    // 1 means locked to another device
    // 2 means not locked but this device is locked to another account
    // 3 means both device and account are unlocked
    const router = useRouter()
    const [locked, setLocked ]= useState<boolean>(false)


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
            {deviceId, jwt: userData.jwt},
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
        const deviceId = await getId(
            {publicKey, jwt: userData.jwt},
            {
                onSuccess: (response)=>{
                    secureLocalStorage.setItem('deviceId', response.data)
                }
            }
        )
        login()
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
                            <Button onClick={login}>Ok</Button>
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
    

    // Logout function
    const handleClose = () => {
        setOpen(false);
        updateUser('', '')
        secureLocalStorage.removeItem('jwt')
        localStorage.removeItem('jwt-time')
    };

    const login = () =>{
        router.push('/home')
    }

    useEffect(()=>{
        fetchLocked(userData.jwt)
    }, [])

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