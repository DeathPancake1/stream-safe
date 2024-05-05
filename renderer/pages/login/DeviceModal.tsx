'use client'

import { Dialog } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import { useCheckId, useCheckLocked, useGetId } from "../../api/hooks/device-hook";
import { useEffect, useState } from "react";
import generateAsymmetricKeys from "../../helpers/device/generateAsymmetric";
import { useRouter } from "next/router";
import { useUser } from "../../providers/UserContext";
import { checkAccountState, fetchLocked } from "../../helpers/logicHooks/Login/DeviceModalLogic";
import { renderDialogContent } from "../../helpers/logicHooks/Login/renderDialogContent";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";

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
    const [locked, setLocked ]= useState<boolean | null>(null)

    const lockThisDevice = async ()=>{
        const {publicKey, privateKey} = await generateAsymmetricKeys()
        const masterKey = await generateSymmetricKey256()
        secureLocalStorage.setItem('masterKey', masterKey)
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
        fetchLocked(userData.jwt, checkLocked, setLocked)
    }, [])

    useEffect(() => {
        if(locked != null)
        checkAccountState(locked, userData, setState, checkId);
    }, [locked]);

    useEffect(() => {
        console.log(state)
    }, [state]);

    return(
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {renderDialogContent(state, login, handleClose, lockThisDevice)}
        </Dialog>
    )
}