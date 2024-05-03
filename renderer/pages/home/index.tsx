import { Box } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import { useState } from "react";
import { useHomeLogic } from "../../helpers/logicHooks/Home/HomeLogic";
import ChannelType from "../../types/channel-type";
import { ChatTypeEnum } from "../../types/chat-type-enum";
import Channel from "./Channel";
import Welcome from "../../components/auth/Welcome";

export default function Home(){
  const [selectedChat, setSelectedChat] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>({
    channelId: '',
    ownerEmail: '',
    name: '',
    key: ''
  })
  const [selectedType, setSelectedType] = useState<ChatTypeEnum>()
  const [width, setWidth] = useState<number>(200); // Initial width
  
  useHomeLogic()

  return (
    <Box sx={{display: 'flex', height: `calc(100vh - 80px)`}}>
      <MyDrawer 
        selectedChat={selectedChat} 
        setSelectedChat={setSelectedChat} 
        width={width} setWidth={setWidth}
        setSelectedType={setSelectedType}
        setSelectedChannel={setSelectedChannel}
        selectedChannel={selectedChannel}
        selectedType={selectedType}
      />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(90% - ${width}px)` }}>
        {
          selectedType === ChatTypeEnum.chat?
          <Chat email={selectedChat}/>
          :
          selectedType === ChatTypeEnum.channel?
          <Channel channel={selectedChannel} />
          :
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
        }
      </Box>
    </Box>
  )
}