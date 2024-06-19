'use client'
import SyncIcon from '@mui/icons-material/Sync';
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type FileStatusProps = {
    file: File
    removeFile: (file: File) => void
    upload: (file: File) => void,
}

const FileStatus = ({
    file,
    removeFile,
    upload,
}: FileStatusProps) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <Box
            sx={{
                backgroundColor: 'primary.primaryLight4',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                position: 'relative',
                borderRadius: '8px',
                width: "100%"
            }}
        >
            <Box>
                <Box
                    sx={{
                        padding: '20px 17px',
                        borderRadius: '8px',
                    }}
                >
                    <InsertDriveFileIcon sx={{
                        fontSize: 38
                    }} />
                </Box>
            </Box>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingLeft: 10,
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    style={{
                        textTransform: 'none',
                        fontWeight: 700,
                    }}
                >
                    {file?.name}
                </Typography>
                <Button 
                    component="label" 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />} 
                    disabled={isLoading}
                    onClick={()=>{
                        upload(file) 
                        setIsLoading(true)
                        }
                    } 
                    fullWidth
                >
                    Upload file
                </Button>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'end',
                    }}
                >
                    <Typography
                        sx={{
                            paddingLeft: '5px',
                            fontWeight: 700,
                        }}
                        width={'100%'}
                    >
                        { isLoading && <LinearProgress /> }
                    </Typography>
                </Box>
            </Box>
            <IconButton
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    color: 'black'
                }}
                onClick={() => removeFile(file)}
            >
                <CloseIcon />
            </IconButton>
        </Box>
    )
}

export default FileStatus
