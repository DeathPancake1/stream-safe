import { Box, Divider, Typography, Button } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import ChatBody from "./ChatBody";
import ChatType from "../../types/chat-type";
import CurrentMessage from "./CurrentMessage";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import ChannelType from "../../types/channel-type";
import ChannelCurrentMessage from "./ChannelCurrentMessage";
import ChannelBody from "./ChannelBody";

interface Props {
  channel?: ChannelType
}

export default function Channel({
    channel = {
        channelId: '',
        ownerEmail: '',
        name: '',
        key: ''
    }
}: Props) {

  const {userData, updateUser}= useUser()
  
  return (
    <Box sx={{ maxWidth: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {channel ? (
        // When email exists, show the chat box
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
          }}
        >
          <Box>
              <Typography fontSize={24}>{channel.name}</Typography>
              <Typography fontSize={12}>{"Owner Email: " + channel.ownerEmail}</Typography>
              <Divider />
          </Box>
        

          {/* Display the exchanged messages */}
          <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: '3px',
                width: "100%",
              }}
          >
              <ChannelBody channel={channel}/>
          </Box>

          {/* Divider */}
          <Divider />

          {/* Button to upload a file */}
          {
            channel.ownerEmail === userData.email?
                <ChannelCurrentMessage channel={channel}/>
            :
                <Box
                    sx={{
                        textAlign: 'center'
                    }}
                >
                    <Typography>
                        Only channel owner allowed to send messages
                    </Typography>
                </Box>
          }
          
            
        </Box>
      ) : (
        // When email doesn't exist, show the welcome component
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Welcome />
        </Box>
      )}
    </Box>
  );
}
