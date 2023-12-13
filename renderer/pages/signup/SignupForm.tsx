"use client"

import { Box, Button, Link, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { getSignupFields } from "../../helpers/auth/signupFields"
import { useSignup } from "../../api/hooks/auth-hook"

interface FormData {
    firstname: string
    lastname: string
    email: string
    confirmEmail: string
    password: string
    confirmPassword: string
}

export default function SignupForm() {
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

    const {mutate: register, isLoading, isError} = useSignup()

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        delete data.confirmEmail
        delete data.confirmPassword
        const email = await register(data)
    }

    const fields = getSignupFields(errors, watch)
    return (
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '60%'
            }}
        >
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