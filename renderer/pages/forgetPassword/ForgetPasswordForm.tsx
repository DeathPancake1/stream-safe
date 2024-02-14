"use client"

import { Box, Button, Typography } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import Field from "../../components/auth/Field"
import { useRouter } from 'next/router'
import { getForgetPasswordField } from "../../helpers/auth/forgetPasswordFields"

interface FormData {
    email: string
}

export default function SignupForm() {
    
    const router = useRouter()

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
        router.push('/verify');
    }

    const fields = getForgetPasswordField(errors)

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