import { Box, Button } from "@mui/material";
import ChatType from "../../types/chat-type";
import { useEffect, useState } from "react";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import secureLocalStorage from "react-secure-storage";


interface Props{
    chat: ChatType
}

export default function ChatBody({
    chat,
}: Props){
    const [symmetricKey, setSymmetricKey] = useState<string>('')

    const generateConversationKey= async ()=>{
        const keyHex = await generateSymmetricKey256()
        setSymmetricKey(keyHex)
    }

    useEffect(()=>{
        const KeyId = chat.email+'-'+'key'
        secureLocalStorage.setItem(KeyId, symmetricKey)
    }, [symmetricKey])

    useEffect(()=>{
        // Check the server if there is a conversation key already
    }, [])

    return(
        <Box>
            <Button onClick={()=>{generateConversationKey()}} variant="contained">
                Exchange keys
            </Button>
        </Box>
    )
}