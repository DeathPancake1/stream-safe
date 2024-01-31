"use client"

import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { getSigninFields } from "../../helpers/auth/signinFields"
import { useSignin } from "../../api/hooks/auth-hook"
import { useEffect, useState } from "react"
import secureLocalStorage from "react-secure-storage"
import DeviceModal from "./DeviceModal"
import { useUser } from "../../providers/UserContext"

interface FormData {
    email: string
    password: string
}

export default function LoginForm() {
    const [open, setOpen] = useState<boolean>()
    const [openModal, setOpenModal] = useState<boolean>()
    const {mutate: login} = useSignin()
    const { userData, updateUser } = useUser();
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try{
            await login(
                data,
                {
                    onSuccess: (response) =>{
                        if(response.status===201){
                            secureLocalStorage.setItem('jwt', response.data.token.accessToken)
                            const date = new Date
                            localStorage.setItem('jwt-time', date.toString())
                            updateUser(response.data.user.email, response.data.token.accessToken)
                            setOpenModal(true)
                        }else{
                            setOpen(true)
                        }
                    }
                }
            )
        }catch(error){
            setOpen(true)
        }
    }
    const fields = getSigninFields(errors)

    // on initial load set user email to empty
    useEffect(()=>{
        updateUser('', '')
    }, [])
    return (
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '90%'
            }}
        >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} >Invalid credentials</Alert>
            </Snackbar>
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    fields.map((field, index)=>
                        <Field
                            key={index}
                            control={control}
                            type={field.type}
                            name={field.name}
                            error={field.error? true: false}
                            errorMessage={field.error?.message}
                            placeholder={field.placeholder}
                            rules={field.rules}
                        />
                    )
                }
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button
                        variant="text"
                        sx={{
                            marginLeft: '10px'
                        }}
                    >
                        forgot password?
                    </Button>
                </Box>
                <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{
                        padding: '15px',
                        margin: '10px'
                    }}
                    type="submit"
                >
                    Sign in
                </Button>
                <Box>
                    <Typography noWrap component="div" textAlign={'center'}>
                        {/* eslint-disable-next-line react/no-unescaped-entities*/}
                        Don't have an account?
                        <Link href="/signup">
                            <Button variant="text">
                                Sign up
                            </Button>
                        </Link>
                    </Typography>
                </Box>
            </form>
            {openModal && <DeviceModal open={openModal} setOpen={setOpenModal} />}
        </Box>
    )
}