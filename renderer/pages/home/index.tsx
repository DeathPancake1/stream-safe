import { Box } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import ChatType from "../../types/chat-type";
import { useState } from "react";
import { useHomeLogic } from "./logicHooks/HomeLogic";

export default function Home(){
  const [selectedChat, setSelectedChat] = useState<ChatType>({
    firstname: '',
    lastname: '',
    email: '',
    publicKey: ''
  })
  
  useHomeLogic()

  return (
    <Box sx={{display: 'flex', height: `calc(100vh - 80px)`}}>
      <MyDrawer selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Chat chat={selectedChat}/>
      </Box>
    </Box>
  )
}