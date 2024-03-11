import { Box, IconButton, Slider, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../themes/theme";
import { useUser } from "../../providers/UserContext";

interface Props {
  visible: boolean;
  videoUrl: string;
  setVideoUrl: (video: string) => void;
  setVisible: (visible: boolean) => void;
}

export default function VideoPlayer({
  visible,
  videoUrl,
  setVideoUrl,
  setVisible,
}: Props) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const playerContainerRef = useRef(null);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {userData, updateUser} = useUser()
  const [position, setPosition] = useState({ top: '0%', left: '0%' });


  const updatePosition = () => {
    if (playerContainerRef.current) {
      const playerRect = playerContainerRef.current.getBoundingClientRect()
      setPosition({
        top: `${Math.floor(Math.random() * (playerRect.bottom - 50 - playerRect.top + 1)) + playerRect.top}px`,
        left: `${Math.floor(Math.random() * (playerRect.right - 200 - playerRect.left + 1)) + playerRect.left}px`,
      });
    }
  };

  const handleClose = () => {
    setPlaying(false);
    setMuted(false);
    setVideoUrl('');
    setVisible(false);
    setCurrentTime(0);
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

  useEffect(() => {
    const intervalId = setInterval(updatePosition, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(()=>{
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose()
      }
    };
    document.addEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    // Create the blob URL when the component mounts
    if (videoUrl) {
      const url = videoUrl
      setBlobUrl(url);

      return () => {
        // Revoke the blob URL when the component unmounts
        URL.revokeObjectURL(url);
      };
    }
  }, [videoUrl]);

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

  const watermarkOverlay = (
    <Box
      sx={{
        position: "absolute",
        left: position.left,
        top: position.top,
        zIndex: 2002,
        backgroundColor: 'rgb(0, 0, 0, 0.7)',
        width: "fit-content",
        padding: "4px",
        borderRadius: "2px",
        cursor: "default"
      }}
    >
      <Typography variant="body2" color={theme.palette.secondary.main} sx={{margin:"auto"}} fontSize={20}>
        {userData.email}
      </Typography>
    </Box>
  )

  const controlsOverlay = (
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
          onClick={() => setPlaying((prev) => !prev)}
        >
          {playing ? <PauseIcon fontSize="large"/> : <PlayArrowIcon  fontSize="large"/> }
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => setMuted((prev) => !prev)}
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
  );

  return (
    <Box
      sx={{
        display: visible ? "flex" : "none",
        position: "absolute",
        top: 0,
        right: 0,
        textAlign: "center",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        width: "100vw",
        height: "100vh",
        padding: "0",
        margin: "0",
        overflow: "hidden"
      }}
    >
      {controlsOverlay}
      {watermarkOverlay}
      {videoUrl && (
        <Box 
          ref={playerContainerRef} 
          sx={{
            width: "fit-content",
            height: "fit-content",
            margin: "auto"
          }}
        >
          <ReactPlayer
            ref={playerRef}
            width={"100%"}
            height={"100%"}
            url={blobUrl}
            playing={playerReady && playing}
            muted={muted}
            onReady={() => {
              setPlayerReady(true);
            }}
            onEnded={() => {
              setPlaying(false)
              setCurrentTime(duration)
            }}
            onProgress={(progress) =>
              setCurrentTime(Math.floor(progress.playedSeconds))
            }
            onDuration={handleDuration}
          />
        </Box>
      )}
    </Box>
  );
}
