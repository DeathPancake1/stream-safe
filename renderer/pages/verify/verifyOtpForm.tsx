import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import { useReceiveOTP, useSendVer } from '../../api/hooks/auth-hook';
import { useUser } from '../../providers/UserContext';


interface FormData {
    otp: string
}


export default function VerifyOtpForm() {
    const [otp, setOtp] = useState('');
    const router = useRouter()
    const [timer, setTimer] = useState(120);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const { mutate: receiveOTP, isLoading: receiveOTPLoading } = useReceiveOTP();
    const { mutate: sendVerify, isLoading: sendVerifyLoading } = useSendVer();
    const {userData,updateUser}= useUser()
    const [open, setOpen] = useState<boolean>()
    const [openOTP6, setOpenOTP6] = useState<boolean>()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };


    useEffect(() => {
        let intervalId: NodeJS.Timeout;
    
        if (isTimerActive && timer > 0) {
          intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
        }
    
        return () => {
            clearInterval(intervalId);
                    };
            }, [isTimerActive, timer]);

    useEffect(() => {
        if (timer === 0) {
            setIsTimerActive(false);
        }
    }, [timer]);
    
    
    const onSubmit = async (event) => {
        event.preventDefault()
        if(otp.length===6){
            receiveOTP({email:userData.email , otp:otp, verifyOrForget:false},
            {
                onSuccess: (response) => {
                    if (response.status === 200) {
                        router.push('/resetPassword');
                    }
                    else{
                        setOpen(true)
                    }
                }
                })
        }
        else{
            setOpenOTP6(true)
        }
    }

    const goBack = () => {
        router.back();
    };

    const handleSendAgain = (event) => {
        setTimer(120); 
        setIsTimerActive(true);
        sendVerify({email : userData.email, verifyOrForget:false},
            {
            onSuccess: (response) => {
            }
          })
    };
    
    return (
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '60%',
                alignItems: 'center',
                margin: 'auto',
                flexDirection: 'column'
            }}
        >
            <Snackbar open={openOTP6} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>OTP less than 6 digits!</Alert>
            </Snackbar> 
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>invalid OTP</Alert>
            </Snackbar> 
            <form onSubmit={onSubmit}>
                <Typography variant="h4" align="center" sx={{ marginBottom: '20px' }}>
                    Verify
                </Typography>
                <Typography variant="h6" align="center" sx={{ marginBottom: '50px' }}>
                    Your code was sent to you via email
                </Typography>

                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span> </span>}
                    //placeholder='xxxxxx'
                    inputType='tel'
                    renderInput={(props) => <input {...props} />}
                    containerStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                    inputStyle={{
                        width: '50px', 
                        height: '50px', 
                        fontSize: '24px', 
                        margin: '0 10px', 
                    }}
                />
                <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{
                        padding: '15px',
                        margin: '20px 10px 5px 10px'
                    }}
                    type="submit"
                >
                    Verify
                </Button>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{
                        padding: '15px',
                        margin: '5px 10px 10px 10px'
                        
                    }}
                    onClick={goBack}
                >
                    Back
                </Button>
                <Box>
                    <Typography noWrap component="div" textAlign={'center'}>
                        {/* eslint-disable-next-line react/no-unescaped-entities*/}
                        Didn't recieve code?{' '}
                        {isTimerActive ? (
                            <span>{timer}s</span>
                        ) : (
                            <Link onClick={handleSendAgain}>
                                <Button variant="text" disabled={isTimerActive}>
                                Send again
                                </Button>
                            </Link>
                        )}
                    </Typography>
                </Box>
            </form>
        </Box>
       
      );
    }