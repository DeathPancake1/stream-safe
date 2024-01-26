import { Box, Button } from "@mui/material";
import ChatType from "../../types/chat-type";
import { useEffect, useState } from "react";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import secureLocalStorage from "react-secure-storage";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";
import formatPublicKey from "../../helpers/keyExchange/formatPublic";


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
        const formattedPublic = formatPublicKey(chat.publicKey)
        encryptSymmetricKey(formattedPublic, symmetricKey)
    }

    const encryptSymmetricKey = async (publicKey: string, plaintext: string)=>{
        const cipherText = await encryptPublic(publicKey, plaintext)
        console.log(cipherText)
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