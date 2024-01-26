import { Box, Divider } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import ChatType from "../../types/chat-type";
import { useReceiverSeen } from "../../api/hooks/key-hook";
import secureLocalStorage from "react-secure-storage";

export default function Home(){
  const [selectedChat, setSelectedChat] = useState<ChatType>({
    firstname: '',
    lastname: '',
    email: '',
    publicKey: ''
  })
  const [jwt, setJwt] = useState<string>('')

  const {mutate: receiveKeys} = useReceiverSeen()

  useEffect(()=>{
    const intervalId = setInterval(() => {
      receiveKeys(
        {jwt},
        {
          onSuccess: (response)=>{
            const newKeys = response.data
            newKeys.forEach((key) => {
              const senderEmail = key.senderEmail;
              const encryptedKey = key.encryptedKey;
      
              const keyId = senderEmail + '-key';
              secureLocalStorage.setItem(keyId, encryptedKey);
            });
          }
        }
      )
    }, 10000)
    return () => clearInterval(intervalId);
  }, [jwt])

  useEffect(()=>{
    setJwt(secureLocalStorage.getItem('jwt').toString())
  }, [])

  return (
    <Box sx={{display: 'flex', height: `calc(100vh - 80px)`}}>
      <MyDrawer selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Chat chat={selectedChat}/>
      </Box>
    </Box>
  )
}