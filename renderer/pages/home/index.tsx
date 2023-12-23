"use client"

import { PlayCircleOutline } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useUser } from "../../providers/UserContext";


export default function Home() {
    const [playing, setPlaying] = useState<boolean>();
    const { userData, updateUser } = useUser();
    const [leftPad, setLeftPad] = useState<number>();
    const [topPad, setTopPad] = useState<number>();
  
    useEffect(() => {
      // Function to update leftPad
      const updateLeftPad = () => {
        setLeftPad(Math.random() * 70);
      };
  
      // Update leftPad every 2 seconds
      const intervalIdLeft = setInterval(updateLeftPad, 2000);
  
      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalIdLeft);
    }, []);
  
    useEffect(() => {
      // Function to update topPad
      const updateTopPad = () => {
        setTopPad(Math.random() * 80);
      };
  
      // Update topPad every 2 seconds
      const intervalIdTop = setInterval(updateTopPad, 2000);
  
      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalIdTop);
    }, []);
  
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative', // Make the box a positioning context for absolute positioning
          width: '80%',
          height: '80%',
          marginTop: '5%',
          margin: 'auto'
        }}
      >
        {/* ReactPlayer component */}
        <ReactPlayer width={'100%'} height={'100%'} url='/test.mp4' playing={playing} />
  
        {/* Email overlay */}
        <span
          style={{
            position: 'absolute',
            fontSize: '54px',
            left: `${leftPad}%`,
            top: `${topPad}%`,
            backgroundColor: 'white',
            borderRadius: '8px',
            opacity: '0.4'
          }}
        >
          {userData.email}
        </span>
  
        <IconButton onClick={() => setPlaying((prevState) => !prevState)}>
          <PlayCircleOutline />
        </IconButton>
      </Box>
    );
  }