"use client"

import theme from "../../themes/theme"
import { ThemeProvider } from "@emotion/react"
import { Label } from "@mui/icons-material"
import { Box, Button, InputAdornment, Link, TextField, Typography } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

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

    const onSubmit: SubmitHandler<FormData> = async (data: { email: string; password: string }) => {
        
    }
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    marginTop: '100px',
                    maxWidth: '60%'
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
                                placeholder='email@example.com'
                                sx={{
                                    margin: '10px',
                                    maxWidth: '100%'
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
                        name='confirmEmail'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={errors.confirmEmail? true: false}
                                helperText={errors.confirmEmail?.message}
                                placeholder='confirmEmail@example.com'
                                sx={{
                                    margin: '10px',
                                    maxWidth: '100%'
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
                            required: 'Confirm email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Invalid email address',
                            },
                            validate: {
                              matchesEmail: (value) =>
                                value === watch('email') || 'Emails do not match',
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
                                type="password"
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
                    <Controller
                        control={control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type="password"
                                error={errors.confirmPassword? true: false}
                                helperText={
                                    <span>{errors.confirmPassword?.message}</span>
                                }
                                placeholder='Confirm password (at least 8 characters)'
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
                            required: 'Confirm password is required',
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
                            validate: {
                                matchesPassword: (value) =>
                                  value === watch('password') || 'Passwords do not match',
                            },
                        }} 
                    />
                    <Controller
                        control={control}
                        name='firstname'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={errors.firstname? true: false}
                                helperText={
                                    <span>{errors.firstname?.message}</span>
                                }
                                placeholder='Firstname'
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
                            required: 'Firstname is required',
                            minLength: {
                            value: 3,
                            message: 'Firstname must be at least 3 characters',
                            },
                            maxLength: {
                            value: 16,
                            message: 'Firstname must not exceed 16 characters',
                            },
                        }}
                    />
                    <Controller
                        control={control}
                        name='lastname'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={errors.lastname? true: false}
                                helperText={
                                    <span>{errors.lastname?.message}</span>
                                }
                                placeholder='Lastname'
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
                            required: 'Lastname is required',
                            minLength: {
                            value: 3,
                            message: 'Lastname must be at least 3 characters',
                            },
                            maxLength: {
                            value: 16,
                            message: 'Lastname must not exceed 16 characters',
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
        </ThemeProvider>
    )
}