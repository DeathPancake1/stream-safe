import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { Box, Button, Link, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from 'next/router'

interface FormData {
    otp: string
}

export default function VerifyOtpForm() {
    const [otp, setOtp] = useState('');
    const router = useRouter()

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormData>({
        defaultValues: {
            otp: '',
        },
    })
    
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        console.log("submitted otp")
    }

    const goBack = () => {
        router.back();
    };

    const handleSendAgain = () => {
        handleSubmit(onSubmit)();
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        Didn't recieve code?
                        <Link onClick={handleSendAgain}>
                            <Button variant="text">
                                Send again
                            </Button>
                        </Link>
                    </Typography>
                </Box>
            </form>
        </Box>
       
      );
    }