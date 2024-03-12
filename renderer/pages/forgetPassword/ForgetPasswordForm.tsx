"use client"

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert, Box, Button, Snackbar, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { useRouter } from 'next/router'
import { getForgetPasswordFields } from "../../helpers/auth/forgetPasswordFields"
import { useSendVer } from "../../api/hooks/auth-hook"
import { useState } from "react"
import { useUser } from "../../providers/UserContext";

interface FormData {
    email: string
}

export default function ForgetPasswordForm() {
    const { mutate: sendVerify, isLoading: sendVerifyLoading } = useSendVer();
    const [open, setOpen] = useState<boolean>()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };
    const router = useRouter()
    const {userData,updateUser}= useUser()

    
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
        },
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        sendVerify({email : data.email},
            {
            onSuccess: (response) => {
              if (response.status === 201) {
                updateUser(data.email,"")
                router.push('/verify');
              }
              else{
                setOpen(true)
              }
            }
          })
    }

    const fields = getForgetPasswordFields(errors)

    const goBack = () => {
        router.back();
    };

    return(
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '60%',
                alignItems: 'center',
                margin: 'auto',
                flexDirection: 'column'
            }}
        >
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Couldn't find the email</Alert>
        </Snackbar>
        <form 
                onSubmit={handleSubmit(onSubmit)}
            >
                <Typography variant="h4" align="center" sx={{ marginBottom: '100px' }}>
                    Forget Password
                </Typography>
                {
                    fields.map((field, index)=>
                        <Field
                            key={index}
                            type={field.type}
                            control={control}
                            name={field.name}
                            error={field.error? true: false}
                            errorMessage={field.error?.message}
                            placeholder={field.placeholder}
                            rules={field.rules}
                        />
                    )
                }
                <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{
                        padding: '15px',
                        margin: '20px 10px 5px 10px'
                    }}
                    type="submit"
                >
                    Reset Password
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
            </form>


        </Box>
    )
}