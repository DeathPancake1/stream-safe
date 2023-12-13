"use client"

import { Label } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { Control, Controller, FieldValues, RegisterOptions } from "react-hook-form";

interface props{
    control: Control<any>
    name: string
    error: boolean
    errorMessage: string
    placeholder: string
    type?: string
    rules: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
}

export default function Field (
    {
        control,
        name,
        error,
        errorMessage,
        placeholder,
        type = 'text',
        rules
    }: props
){
    return(
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <TextField
                    {...field}
                    fullWidth
                    type={type}
                    error={error}
                    helperText={errorMessage}
                    placeholder={placeholder}
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
            rules={rules}
        />
    )
}