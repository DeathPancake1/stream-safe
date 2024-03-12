import { Alert, Box, Button, Snackbar, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { useRouter } from 'next/router'
import { getResetPasswordFields } from "../../helpers/auth/resetPasswordFields"
import React, { useState } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useChangePassword } from "../../api/hooks/auth-hook"
import { useUser } from "../../providers/UserContext"


interface FormData {
    password: string
    confirmPassword: string
}

export default function ResetPasswordForm() {
    const router = useRouter()
    const { mutate: changePassword, isLoading: sendVerifyLoading } = useChangePassword();
    const [open, setOpen] = useState<boolean>()
    const {userData,updateUser}= useUser()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
    })

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        changePassword({email: userData.email, password: data.password},
            {
                onSuccess: (response) => {
                    if (response.status === 200) {
                        router.push('/login');
                    }
                    else{
                        setOpen(true)
                    }
                }
                })
    }

    const fields = getResetPasswordFields(errors, watch)

    const cancel = () => {
        router.push('/login');
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
                <Alert onClose={handleClose} severity="success" 
                    sx={{
                        width: '100%',
                        backgroundColor: '#4CAF50',
                        color: '#FFF', 
                        display: 'flex',
                        alignItems: 'center'
                        }}
                    action={
                    <CheckCircleIcon fontSize="inherit" sx={{ marginRight: 0.5 }} />} >
                    couldn't change password
                </Alert>
            </Snackbar>
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >
                <Typography variant="h4" align="center" sx={{ marginBottom: '100px' }}>
                    Reset Password
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
                    Confirm
                </Button>
                <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{
                        padding: '15px',
                        margin: '5px 10px 10px 10px'
                        
                    }}
                    onClick={cancel}
                >
                    Cancel
                </Button>
            </form>
        </Box>
    )
}