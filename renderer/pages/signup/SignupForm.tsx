"use client"

import { Alert, Box, Button, Link, Snackbar, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { getSignupFields } from "../../helpers/auth/signupFields"
import { useSignup } from "../../api/hooks/auth-hook"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { useUser } from "../../providers/UserContext"

interface FormData {
    firstname: string
    lastname: string
    email: string
    confirmEmail: string
    password: string
    confirmPassword: string
}

export default function SignupForm() {
    const [open, setOpen] = useState<boolean>()
    const [email, setEmail] = useState<string>('')
    
    const router = useRouter()

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            confirmEmail: '',
            password: '',
            firstname: '',
            lastname: '',
            confirmPassword: ''
        },
    })
    const { userData, updateUser } = useUser();

    const {mutate: register, isLoading, isError} = useSignup()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try{
            delete data.confirmEmail
            delete data.confirmPassword
            await register(
                data,
                {
                    onSuccess: (response) => {
                      setEmail(response)
                    },
                }    
            )
            if(email){
                router.push('/login');
            }
            else{
                setOpen(true)
            }
        }
        catch(error){
            setOpen(true)
        }
        
    }

    const fields = getSignupFields(errors, watch)


    return (
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '60%'
            }}
        >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Email already exists</Alert>
            </Snackbar>
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >
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
                    Sign up
                </Button>
                <Box>
                    <Typography noWrap component="div" textAlign={'center'}>
                        {/* eslint-disable-next-line react/no-unescaped-entities*/}
                        Already have an account?
                        <Link href="/login">
                            <Button variant="text">
                                Sign in
                            </Button>
                        </Link>
                    </Typography>
                </Box>
            </form>
        </Box>
    )
}