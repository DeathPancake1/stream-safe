import { Box } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import ChatType from "../../types/chat-type";
import { useState } from "react";
import { useHomeLogic } from "../../helpers/logicHooks/Home/HomeLogic";

export default function Home(){
  const [selectedChat, setSelectedChat] = useState<string>('')
  const [width, setWidth] = useState<number>(200); // Initial width
  
  useHomeLogic()

  return (
    <Box sx={{display: 'flex', height: `calc(100vh - 80px)`}}>
      <MyDrawer selectedChat={selectedChat} setSelectedChat={setSelectedChat} width={width} setWidth={setWidth}/>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(90% - ${width}px)` }}>
        <Chat email={selectedChat}/>
      </Box>
    </Box>
  )
}