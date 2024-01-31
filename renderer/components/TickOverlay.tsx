// TickOverlay.tsx
import React, { MouseEventHandler } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Props{
    onClick: MouseEventHandler<HTMLDivElement>
}

export default function TickOverlay({
    onClick
    }: Props) {
    return (
        <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{cursor: 'pointer', backgroundColor: 'white 0.5'}}
            zIndex={1000}
            onClick = {onClick}
        >
            <Box position="relative" textAlign="center">
                <CircularProgress style={{ visibility: 'hidden' }} size={50} />
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        strokeDasharray: '1000',
                        strokeDashoffset: '1000',
                        animation: 'drawTick 2s ease-out forwards', // Adjust the animation duration and timing function
                    }}
                >
                    <path
                        fill="none"
                        d="M21.34,6.34L9,18.69l-4.34-4.34L3,15.31l6,6,13-13Z"
                        stroke="#4caf50"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <Typography variant="body2" color="textSecondary" mt={2}>
                    Done
                </Typography>
            </Box>
            <style>
                {`
                    @keyframes drawTick {
                        to {
                            stroke-dashoffset: 0;
                        }
                    }
                `}
            </style>
        </Box>
    );
}