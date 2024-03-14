import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import SearchBox from "../SearchBox";
import { useSearchUser } from "../../api/hooks/search-hook";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import ChatType from "../../types/chat-type";
import { useUser } from "../../providers/UserContext";
import Iconbar from "./Iconbar";
import { useLiveQuery } from "dexie-react-hooks";
import { videosDB } from "../../indexedDB";
import { channelsDB } from "../../indexedDB/channel.db";
import ChannelType from "../../types/channel-type";
import { ChatTypeEnum } from "../../types/chat-type-enum";
import theme from "../../themes/theme";

interface Props {
  selectedChat: string,
  selectedType: ChatTypeEnum,
  selectedChannel: ChannelType
  setSelectedChat: (email: string) => void,
  setSelectedChannel: (channel: ChannelType) => void,
  setSelectedType: (type: ChatTypeEnum) => void,
  width: number,
  setWidth: (width: number)=>void
}

export function MyDrawer({
  selectedChat,
  selectedChannel,
  selectedType,
  setSelectedChat,
  setSelectedChannel,
  setSelectedType,
  width,
  setWidth
}: Props) {
  const { mutate: search, isLoading: searchLoading } = useSearchUser();
  const [chats, setChats] = useState<ChatType[]>([]);
  const { userData, updateUser } = useUser();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const [uniqueReceivers, setUniqueReceivers] = useState<string[]>([])
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([])
  const [combinedUniqueUsers, setCombinedUniqueUsers] = useState<string[]>([]);
  const [searchLength, setSearchLength] = useState<number>(0);
  const [channels, setChannels] = useState<ChannelType[]>();


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

  useLiveQuery(
    async () => {
      const channelsFromDb = await channelsDB.channels
        .where('userEmail')
        .equalsIgnoreCase(userData.email)
        .sortBy('date');

      const uniqueChannel = Array.from(new Set(channelsFromDb.map((channel) => {
          return {
            name: channel.name,
            channelId: channel.channelId,
            ownerEmail: channel.ownerEmail,
            key: channel.channelKey
          };
      })));
      
      setChannels(uniqueChannel)
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
    setSearchLength(email.length)
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
    else{
      setChats([])
    }
  };

  const handleSetChat = (email: string) => {
    setSelectedType(ChatTypeEnum.chat)
    setSelectedChat(email);
    console.log(email)
  };


  const handleSetChannel = (channel: ChannelType) => {
    setSelectedType(ChatTypeEnum.channel)
    setSelectedChannel(channel);
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
          <SearchBox search={handleSearch}/>
          <Typography
            sx={{
              textAlign: 'center'
            }}
            fontSize={12}
            color={theme.palette.grey[400]}
          >
            Channels
          </Typography>
          {
            (channels && channels.map((channel, index) => (
              <ListItem
                key={index}
                disablePadding
              >
                <ListItemButton 
                  selected={selectedChannel && selectedChannel === channel && selectedType === ChatTypeEnum.channel} 
                  onClick={() => handleSetChannel(channel)}
                >
                  <ListItemIcon>
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={channel.name}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )))
          }
          <Typography
            sx={{
              textAlign: 'center'
            }}
            fontSize={12}
            color={theme.palette.grey[400]}
          >
            Chats
          </Typography>
          {
            searchLoading?
              <CircularProgress />
            :
            chats.length>0?
            chats.map((chat, index) => (
              <ListItem
                key={chat.email}
                disablePadding
                selected={selectedChat && selectedChat === chat.email}
              >
                <ListItemButton onClick={() => handleSetChat(chat.email)}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={chat.email}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
            :
            searchLength < 3?
              combinedUniqueUsers.map((email, index) => (
                <ListItem
                  key={email}
                  disablePadding
                >
                  <ListItemButton 
                    selected = {selectedChat && selectedChat === email && selectedType === ChatTypeEnum.chat} 
                    onClick={() => handleSetChat(email)}
                  >
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
              ))
            :
              <Typography
                sx={{
                  textAlign: 'center',
                  paddingTop: '10px',
                  opacity: '0.5',
                  maxWidth: '100%',
                  width: 'fit-content',
                  height: 'fit-content',
                  margin: 'auto'
                }}
              >
                There are no results for the search query
              </Typography>
          }
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
