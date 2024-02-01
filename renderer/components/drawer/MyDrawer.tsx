import { Inbox, Mail } from "@mui/icons-material";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import SearchBox from "../SearchBox";
import { useSearchUser } from "../../api/hooks/search-hook";
import { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatType from "../../types/chat-type";
import { useUser } from "../../providers/UserContext";

interface Props {
  selectedChat: ChatType,
  setSelectedChat: (chat: ChatType) => void
}

export function MyDrawer({
  selectedChat,
  setSelectedChat,
}: Props) {
  const { mutate: search } = useSearchUser();
  const [chats, setChats] = useState<ChatType[]>([]);
  const { userData, updateUser } = useUser();

  async function handleSearch({ email }: { email: string }) {
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

  const handleSetChat = (chat: ChatType) => {
    setSelectedChat(chat);
  }

  useEffect(() => {
    handleSearch({ email: '' });
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 300, boxSizing: 'border-box' },
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
                <ListItemText primary={chat.email} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
