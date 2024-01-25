import { Inbox, Mail } from "@mui/icons-material";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import SearchBox from "../SearchBox";
import { useFindEmail } from "../../api/hooks/search-hook";
import { useState } from "react";

type Chat = {
  firstname: string,
  lastname: string,
  email: string,
  publicKey: string,
}

export function MyDrawer() {
    const { mutate: search } = useFindEmail();
    const [ chats, setChats ] = useState<Chat[]>([]);

    async function handleSearch({email, jwt} : {email: string, jwt: string}){
      await search(
        {email, jwt},
        {
          onSuccess: (response)=>{
            setChats(chats.concat({
              firstname: 'test',
              lastname: 'test',
              email: 'test12@email.com',
              publicKey: 'test'
            }))
            console.log(chats)
          }
        }
      )
    }

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
              <SearchBox search={handleSearch} />
              {chats.map((chat, index) => (
                <ListItem key={chat.email} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <Inbox /> : <Mail />}
                    </ListItemIcon>
                    <ListItemText primary={chat.email} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
      </Drawer>
    )
}