'use client'
import SyncIcon from '@mui/icons-material/Sync';
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    Typography,
    linearProgressClasses,
    styled,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../themes/theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type FileStatusProps = {
    file: File
    removeFile: (file: File) => void
    upload: (file: File) => void
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
});

const FileStatus = ({
    file,
    removeFile,
    upload,
}: FileStatusProps) => {

    return (
        <Box
            sx={{
                backgroundColor: 'primary.primaryLight4',
                padding: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                position: 'relative',
                borderRadius: '8px',
                width: 'calc(100vw - 400px)'
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
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onClick={()=>upload(file)} fullWidth>
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
                    >
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
