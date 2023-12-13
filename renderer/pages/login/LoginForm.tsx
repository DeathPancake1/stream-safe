"use client"

import { Box, Button, Link, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { getSigninFields } from "../../helpers/auth/signinFields"

interface FormData {
    email: string
    password: string
}

export default function LoginForm() {
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

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        
    }
    const fields = getSigninFields(errors)
    return (
        <Box
            sx={{
                marginTop: '100px',
                maxWidth: '90%'
            }}
        >
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
        </Box>
    )
}