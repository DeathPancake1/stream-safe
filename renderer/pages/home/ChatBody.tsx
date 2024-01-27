import { Box, Button } from "@mui/material";
import ChatType from "../../types/chat-type";
import { useEffect, useState } from "react";
import generateSymmetricKey256 from "../../helpers/keyExchange/generateSymmetric";
import secureLocalStorage from "react-secure-storage";
import encryptPublic from "../../helpers/keyExchange/encryptPublic";
import formatPublicKey from "../../helpers/keyExchange/formatPublic";
import { useCheckConversationKey, useExchangeSymmetric } from "../../api/hooks/key-hook";
import { useUser } from "../../providers/UserContext";

interface Props {
  chat: ChatType;
}

export default function ChatBody({ chat }: Props) {
  const [symmetricKey, setSymmetricKey] = useState<string>('');
  const [keyExists, setKeyExists] = useState<boolean>(false);
  const { mutate: checkConversationKey } = useCheckConversationKey();
  const { mutate: exchangeSymmetric } = useExchangeSymmetric();
  const {userData, updateUser} = useUser()

  const generateConversationKey = async () => {
    const keyHex = await generateSymmetricKey256();
    return keyHex;
  };

  const encryptAndSendSymmetricKey = async (key: string) => {
    const cipherText = await encryptPublic(chat.publicKey, key);
    await exchangeSymmetric(
      { email: chat.email, key: cipherText, jwt: userData.jwt },
      {
        onSuccess: (response) => {
          setKeyExists(true);
        },
      }
    );
  };

  const handleNewKey = async ()=>{
    const keyId = chat.email+'-key';
    const key = await generateConversationKey()
    setSymmetricKey(key)
    secureLocalStorage.setItem(keyId, key)
    await encryptAndSendSymmetricKey(key)
  }

  useEffect(() => {
    // Check the server if there is a conversation key already
    if (userData.jwt) {
      checkConversationKey(
        { email: chat.email, jwt: userData.jwt },
        {
          onSuccess: (response) => {
            setKeyExists(response.data);
          },
        }
      );
    }
  }, [chat]);

  useEffect(() => {
    // If exists load it, if not generate it and send it
    if(!keyExists){
        handleNewKey()
    }
  }, [keyExists]);

  return (
    <Box>
    </Box>
  );
}
