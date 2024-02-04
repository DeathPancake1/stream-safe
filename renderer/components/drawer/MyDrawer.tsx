import React, { useState, useEffect } from "react";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import SearchBox from "../SearchBox";
import { useSearchUser } from "../../api/hooks/search-hook";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatType from "../../types/chat-type";
import { useUser } from "../../providers/UserContext";

interface Props {
  selectedChat: ChatType,
  setSelectedChat: (chat: ChatType) => void,
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
  const [chats, setChats] = useState<ChatType[]>([]);
  const { userData, updateUser } = useUser();
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [initialMouseX, setInitialMouseX] = useState<number>(0);

  const handleSearch = async ({ email }: { email: string }) => {
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
  };

  const handleSetChat = (chat: ChatType) => {
    setSelectedChat(chat);
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
          <SearchBox search={handleSearch} />
          {chats.map((chat, index) => (
            <ListItem
              key={chat.email}
              disablePadding
              selected={selectedChat && selectedChat.email === chat.email}
            >
              <ListItemButton onClick={() => handleSetChat(chat)}>
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
