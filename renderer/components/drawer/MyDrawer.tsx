import React, { useState, useEffect } from "react";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import SearchBox from "../SearchBox";
import { useSearchUser } from "../../api/hooks/search-hook";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatType from "../../types/chat-type";
import { useUser } from "../../providers/UserContext";
import Iconbar from "./Iconbar";
import { useLiveQuery } from "dexie-react-hooks";
import { videosDB } from "../../indexedDB";

interface Props {
  selectedChat: string,
  setSelectedChat: (email: string) => void,
  width: number,
  setWidth: (width: number)=>void
}

export function MyDrawer({
  selectedChat,
  setSelectedChat,
  width,
  setWidth
}: Props) {
  const { mutate: search } = useSearchUser();
  const [chats, setChats] = useState<string[]>([]);
  const { userData, updateUser } = useUser();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const [uniqueReceivers, setUniqueReceivers] = useState<string[]>([])
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([])
  const [combinedUniqueUsers, setCombinedUniqueUsers] = useState<string[]>([]);


  useLiveQuery(
    async () => {
      const sentMessages = await videosDB.videos
        .where('sender')
        .equalsIgnoreCase(userData.email)
        .sortBy('date');
  
      const receivedMessages = await videosDB.videos
        .where('receiver')
        .equalsIgnoreCase(userData.email)
        .sortBy('date');
  
      const allMessages = [...sentMessages, ...receivedMessages];
  
      const uniqueUsers = Array.from(new Set(allMessages.map((video) => {
        if (video.sender === userData.email) {
          return video.receiver;
        } else {
          return video.sender;
        }
      })));
  
      // Sort unique users by the latest message time
      uniqueUsers.sort((userA, userB) => {
        const latestMessageTimeA = getLatestMessageTimeForUser(userA, allMessages);
        const latestMessageTimeB = getLatestMessageTimeForUser(userB, allMessages);
  
        return latestMessageTimeB - latestMessageTimeA;
      });
  
      setCombinedUniqueUsers(uniqueUsers);
    },
    [userData.email]
  );
  
  const getLatestMessageTimeForUser = (user, messages) => {
    const latestMessage = messages
      .filter((video) => video.sender === user || video.receiver === user)
      .sort((a, b) => b.date - a.date)
      .shift();
  
    return latestMessage ? latestMessage.date : 0;
  };
  
  
  const handleSearch = async ({ email }: { email: string }) => {
    if(email.length >= 3){
      search(
        { email, jwt: userData.jwt },
        {
          onSuccess: (response) => {
            if (response.data) {
              setChats(response.data);
            }
          }
        }
      );
    }
  };

  const handleSetChat = (email: string) => {
    setSelectedChat(email);
  };

  const handleMouseDown = (event) => {
    setInitialMouseX(event.clientX);
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      const deltaX = initialMouseX - event.clientX;
      const newWidth = Math.min(Math.max(width - deltaX, 200), 700); // Adjust minimum width as needed
      setWidth(newWidth);
    }
  };

  useEffect(() => {
    handleSearch({ email: '' });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    // Combine unique senders and receivers into a single array
    const combinedUsers = Array.from(new Set([...uniqueReceivers, ...uniqueSenders]));

    // Set the combined unique users state
    setCombinedUniqueUsers(combinedUsers);
  }, [uniqueReceivers, uniqueSenders]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: `${width}px`,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: `${width}px`, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <Divider />
          <Iconbar />
          <SearchBox search={handleSearch} />
          {combinedUniqueUsers.map((email, index) => (
            <ListItem
              key={email}
              disablePadding
              selected={selectedChat && selectedChat === email}
            >
              <ListItemButton onClick={() => handleSetChat(email)}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary={email}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '5px',
          cursor: 'ew-resize',
          padding: '4px 0 0',
          borderTop: '1px solid #ddd',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          backgroundColor: '#f4f7f9',
        }}
      />
    </Drawer>
  );
}
