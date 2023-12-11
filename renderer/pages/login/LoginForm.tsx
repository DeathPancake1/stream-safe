"use client"

import theme from "../../themes/theme"
import { ThemeProvider } from "@emotion/react"
import { Label } from "@mui/icons-material"
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

interface FormData {
    email: string
    password: string
}

export default function LoginForm() {
    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit: SubmitHandler<FormData> = async (data: { email: string; password: string }) => {
        
    }
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    marginTop: '100px'
                }}
            >
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Controller
                        control={control}
                        name='email'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={errors.email? true: false}
                                helperText={errors.email?.message}
                                placeholder='johndoe@example.com'
                                sx={{
                                    margin: '10px',
                                }}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <Label />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name='password'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={errors.password? true: false}
                                helperText={
                                    <span>{errors.password?.message}</span>
                                }
                                placeholder='Password (at least 8 characters)'
                                sx={{
                                    margin: '10px',
                                }}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <Label />
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        rules={{
                            required: 'Password is required',
                            minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                            },
                            maxLength: {
                            value: 32,
                            message: 'Password must not exceed 32 characters',
                            },
                            pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
                            message: 'Must have uppercase,lowercase and num',
                            },
                        }} 
                    />
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
                            <Button variant="text">
                                Sign up
                            </Button>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </ThemeProvider>
    )
}