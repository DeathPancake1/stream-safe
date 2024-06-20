import { Box, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import theme from "../../themes/theme";
import { useUser } from "../../providers/UserContext";
import ControlsOverlay from "./ControlsOverlay";

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
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number | null>(null);
  const playerRef = useRef<ReactPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const { userData } = useUser();
  const [position, setPosition] = useState({ top: '0%', left: '0%' });

  const updatePosition = () => {
    if (playerContainerRef.current) {
      const playerRect = playerContainerRef.current.getBoundingClientRect();
      setPosition({
        top: `${Math.floor(Math.random() * (playerRect.bottom - 50 - playerRect.top + 1)) + playerRect.top}px`,
        left: `${Math.floor(Math.random() * (playerRect.right - 200 - playerRect.left + 1)) + playerRect.left}px`,
      });
    }
  };

  useEffect(() => {
    updatePosition();
    const intervalId = setInterval(updatePosition, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (videoUrl) {
      const url = videoUrl;
      setBlobUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoUrl]);

  const handleDuration = (newDuration: number) => {
    setDuration(newDuration);
  };

  const watermarkOverlay = (
    <Box
      sx={{
        position: "absolute",
        left: position.left,
        top: position.top,
        zIndex: 2002,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: "fit-content",
        padding: "4px",
        borderRadius: "2px",
        cursor: "default"
      }}
    >
      <Typography variant="body2" color={theme.palette.secondary.main} sx={{ margin: "auto" }} fontSize={20}>
        {userData.email}
      </Typography>
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
      <ControlsOverlay
        playing={playing}
        setPlaying={setPlaying}
        setVisible={setVisible}
        setCurrentTime={setCurrentTime}
        setDuration={setDuration}
        setMuted={setMuted}
        setVideoUrl={setVideoUrl}
        playerRef={playerRef}
        muted={muted}
        currentTime={currentTime}
        duration={duration}
      />
      {watermarkOverlay}
      {videoUrl && (
        <Box
          ref={playerContainerRef}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ReactPlayer
            ref={playerRef}
            width="100%"
            height="100%"
            url={blobUrl}
            playing={playerReady && playing}
            muted={muted}
            onReady={() => {
              setPlayerReady(true);
            }}
            onEnded={() => {
              setPlaying(false);
              setCurrentTime(duration);
            }}
            onProgress={(progress) => setCurrentTime(Math.floor(progress.playedSeconds))}
            onDuration={handleDuration}
            style={{ position: "absolute", top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  style: {
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
