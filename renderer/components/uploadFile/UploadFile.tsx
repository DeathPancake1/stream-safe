import { Button, Typography, styled } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useState } from 'react'

type Props = {
    fileList: File[]
    setFiles: (files: File[]) => void
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const UploadFile = ({ fileList, setFiles }: Props) => {
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (fileList) {
            setFiles([...fileList, selectedFile])
        } else {
            setFiles([selectedFile])
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const selectedFile = event.dataTransfer.files[0]
        if (selectedFile) {
            if (fileList) {
                setFiles([...fileList, selectedFile])
            } else {
                setFiles([selectedFile])
            }
        }
    }

    return (
        <Button
            component='label'
            style={{
                // Add your existing styles here
                backgroundImage:
                    'repeating-linear-gradient(-23deg, #000000, #000000 30px, transparent 30px, transparent 40px, #000000 40px), repeating-linear-gradient(67deg, #000000, #000000 30px, transparent 30px, transparent 40px, #000000 40px), repeating-linear-gradient(157deg, #000000, #000000 30px, transparent 30px, transparent 40px, #000000 40px), repeating-linear-gradient(247deg, #000000, #000000 30px, transparent 30px, transparent 40px, #000000 40px)',
                backgroundSize: '2px 100%, 100% 2px, 2px 100%, 100% 2px',
                backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
                backgroundRepeat: 'no-repeat',
                padding: '100px 200px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <VisuallyHiddenInput type='file' onChange={handleFileChange} />
            <FileUploadIcon />
            <Typography
                style={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                }}
            >
                Upload File
            </Typography>
            <Typography style={{ textTransform: 'none' }}>
                Drag or click to upload
            </Typography>
        </Button>
    )
}

export default UploadFile
