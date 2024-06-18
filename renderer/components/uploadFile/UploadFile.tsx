import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, styled } from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import React, { useState } from 'react'

type Props = {
    fileList: File[]
    setFiles: (files: File[]) => void
    allowedTypes: string[]
    maxSize: number
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

const UploadFile = ({ fileList, setFiles, allowedTypes, maxSize }: Props) => {
    const [openAlert, setOpenAlert] = useState<boolean>(false);
    const [sizeError, setSizeError] = useState<boolean>(false);
    const [typeError, setTypeError] = useState<boolean>(false);

    const setFileInArray = (selectedFile) =>{
        if(selectedFile){
            if (allowedTypes && !allowedTypes.includes(selectedFile.type)) {
                setTypeError(true);
                setOpenAlert(true);
                return;
            }
            if (maxSize && selectedFile.size > maxSize) {
                setSizeError(true)
                setOpenAlert(true);
                return;
            }
            setFiles([selectedFile])
        }
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        setFileInArray(selectedFile)
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setSizeError(false);
        setTypeError(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const selectedFile = event.dataTransfer.files[0]
        if (selectedFile) {
            setFileInArray(selectedFile)
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
            <Dialog open={openAlert} onClose={handleCloseAlert}>
                <DialogTitle id="alert-dialog-title">File Alert</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {
                            typeError && "File type is not correct"
                        }
                        {
                            sizeError && "File size is too large"
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>Ok</Button>
                </DialogActions>
            </Dialog>
            <VisuallyHiddenInput type='file' onChange={handleFileChange} accept={allowedTypes.join(',')}/>
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
                Drag or click
            </Typography>
        </Button>
    )
}

export default UploadFile
