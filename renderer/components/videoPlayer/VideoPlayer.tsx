import { Box, IconButton, Slider } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  visible: boolean;
  video: File;
  setVideo: (video: File | null) => void;
  setVisible: (visible: boolean) => void;
}

export default function VideoPlayer({
  visible,
  video,
  setVideo,
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
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setPlaying(false);
    setMuted(false);
    setVideo(null);
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
    // Create the blob URL when the component mounts
    if (video) {
      const url = URL.createObjectURL(video);
      setBlobUrl(url);

      return () => {
        // Revoke the blob URL when the component unmounts
        URL.revokeObjectURL(url);
      };
    }
  }, [video]);

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
      }}
    >
      <IconButton
        color="secondary"
        onClick={() => setPlaying((prev) => !prev)}
      >
        {playing ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
      <IconButton
        color="secondary"
        onClick={() => setMuted((prev) => !prev)}
      >
        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        min={0}
        max={duration || 0} // Use duration as the max value
        value={currentTime}
        onChange={handleSeek}
        sx={{ color: "secondary.main", width: "200px" }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: visible ? "flex" : "none",
        position: "absolute",
        top: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        zIndex: 2000,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          zIndex: 2002,
          position: "absolute",
          top: 0,
          right: 0,
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
      {controlsOverlay}
      {video && (
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
          onEnded={() => setPlaying(false)}
          onProgress={(progress) =>
            setCurrentTime(Math.floor(progress.playedSeconds))
          }
          onDuration={handleDuration}
        />
      )}
    </Box>
  );
}
