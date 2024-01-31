import { Box, Divider } from "@mui/material";
import { MyDrawer } from "../../components/drawer/MyDrawer";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import ChatType from "../../types/chat-type";
import { useReceiverSeen } from "../../api/hooks/key-hook";
import secureLocalStorage from "react-secure-storage";
import formatPrivateKey from "../../helpers/keyExchange/formatPrivate";
import decryptPrivate from "../../helpers/keyExchange/decryptPrivate";
import { useUser } from "../../providers/UserContext";
import { useGetNewMessages } from "../../api/hooks/messages-hook";
import { addKey } from "../../indexedDB";

export default function Home(){
  const [selectedChat, setSelectedChat] = useState<ChatType>({
    firstname: '',
    lastname: '',
    email: '',
    publicKey: ''
  })
  const {userData, updateUser} = useUser()

  const {mutate: receiveKeys} = useReceiverSeen()
  const {mutate: getNewMessages} = useGetNewMessages()

  const getPrivateKey = ()=>{
    const privateKey = secureLocalStorage.getItem('privateKey').toString()
    const privateKeyFormatted = formatPrivateKey(privateKey)
    return privateKeyFormatted
  }

  useEffect(()=>{
    const intervalId = setInterval(() => {
      receiveKeys(
        {jwt: userData.jwt},
        {
          onSuccess: (response)=>{
            const newKeys = response.data
            newKeys.forEach(async (key) => {
              const senderEmail = key.senderEmail;
              const encryptedKey = key.encryptedKey;
      
              const privateKey = getPrivateKey()
              const decryptedKey = await decryptPrivate(privateKey, encryptedKey)
              const id = addKey(senderEmail, decryptedKey)
            });
          }
        }
      )
      getNewMessages(
        {jwt: userData.jwt},
        {
          onSuccess: (response)=>{
            const newMessages = response.data
            // newMessages.forEach((message)=>{
            //   const senderEmail = message.senderEmail;
              
            // })
          }
        }
      )
    }, 10000)
    return () => clearInterval(intervalId);
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