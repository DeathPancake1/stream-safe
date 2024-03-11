import { Box, IconButton, Typography, Slider } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../themes/theme"
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface Props{
    playing: boolean
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>
    muted: boolean
    setMuted: React.Dispatch<React.SetStateAction<boolean>>
    setVideoUrl: React.Dispatch<React.SetStateAction<string>>
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>
    duration: number
    currentTime: number
    playerRef: React.MutableRefObject<ReactPlayer>
    setDuration: React.Dispatch<React.SetStateAction<number>>
}

export default function ControlsOverlay ({
    playing,
    setPlaying,
    muted,
    setMuted,
    setVideoUrl,
    setVisible,
    setCurrentTime,
    duration,
    currentTime,
    playerRef,
    setDuration
}: Props) {
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleClose = () => {
        setPlaying(false);
        setMuted(false);
        setVideoUrl('');
        setVisible(false);
        setCurrentTime(0);
    };

    const handleSeek = (event: Event, value: number | number[]) => {
        if (Array.isArray(value)) {
          return;
        }
    
        setCurrentTime(value);
    
        // Debounce the seek operation
        if (seekTimeoutRef.current) {
          clearTimeout(seekTimeoutRef.current);
        }
    
        seekTimeoutRef.current = setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.seekTo(value, "seconds");
          }
        }, 300); // Adjust the debounce delay as needed
      };
    
      // Handle the duration event to get the video duration
      const handleDuration = (newDuration: number) => {
        setDuration(newDuration);
    };
    
    const formatTime = (timeInSeconds) => {
        if (timeInSeconds === 0) {
          return "00:00";
        }
      
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
      
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
    
        const handleMouseMove = () => {
          setControlsVisible(true);
          clearTimeout(timer);
          timer = setTimeout(() => {
            setControlsVisible(false);
          }, 5000);
        };
    
        document.addEventListener("mousemove", handleMouseMove);
    
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(()=>{
        const handleKeyDown = (event) => {
          if (event.key === "Escape") {
            handleClose()
          }
        };
        document.addEventListener("keydown", handleKeyDown)
    }, [])
    
    return(
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                display: controlsVisible ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 1)",
                padding: 0.5,
                zIndex: 2001,
                flexDirection: "column"
            }}
            >
            <Box
                sx={{
                zIndex: 2002,
                position: "fixed",
                top: 0,
                right: 0,
                backgroundColor: 'rgb(0, 0, 0, 0.7)',
                padding: "4px",
                borderRadius: " 0 0 0 15px",
                }}
            >
                <IconButton
                onClick={handleClose}
                size="large"
                sx={{ width: 35, height: 35 }}
                color="secondary"
                >
                    <CloseIcon sx={{ width: 35, height: 35 }} />
                </IconButton>
            </Box>
            <Box
                sx={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
                }}
            >
                <Box
                    sx={{
                        opacity: "0"
                    }}
                >
                    invisible
                </Box>
                <IconButton
                    color="secondary"
                    style={{
                        alignSelf: "center",
                        fontSize: "50px"
                    }}
                    size={"large"}
                    onClick={() => setPlaying((prev: any) => !prev)}
                >
                    {playing ? <PauseIcon fontSize="large"/> : <PlayArrowIcon  fontSize="large"/> }
                </IconButton>
                <IconButton
                    color="secondary"
                    onClick={() => setMuted((value) => !value)}
                >
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
            </Box>
            <Box
                sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row"
                }}
            >
                <Typography variant="body2" color={theme.palette.secondary.main} sx={{margin:"auto"}} fontSize={15}>
                {
                    formatTime(parseInt(currentTime.toFixed(0))) || "00:00"
                }
                </Typography>
                <Slider
                    min={0}
                    max={duration || 0} // Use duration as the max value
                    value={currentTime}
                    onChange={handleSeek}
                    sx={{
                        color: "secondary.main",
                        width: "85%",
                        margin: "auto"
                    }}
                />
                <Typography variant="body2" color={theme.palette.secondary.main} sx={{margin:"auto"}} fontSize={15}>
                {
                    duration && formatTime(parseInt(duration.toFixed(0)))
                }
                </Typography>
            </Box>
        </Box>
    )
}