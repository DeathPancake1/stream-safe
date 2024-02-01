import { useEffect } from "react"
import { addKey, addVideo } from "../../../indexedDB"
import decryptPrivate from "../../../helpers/keyExchange/decryptPrivate"
import formatPrivateKey from "../../../helpers/keyExchange/formatPrivate"
import secureLocalStorage from "react-secure-storage"
import { useGetNewMessages } from "../../../api/hooks/messages-hook"
import { useReceiverSeen } from "../../../api/hooks/key-hook"
import { useUser } from "../../../providers/UserContext"

export const useHomeLogic = ()=>{
    const {userData, updateUser} = useUser()

    const {mutate: receiveKeys} = useReceiverSeen()
    const {mutate: getNewMessages} = useGetNewMessages()

    const getPrivateKey = ()=>{
        const privateKey = secureLocalStorage.getItem('privateKey').toString()
        const privateKeyFormatted = formatPrivateKey(privateKey)
        return privateKeyFormatted
    }

    const processReceivedKeys = (response) => {
        const newKeys = response.data;
        newKeys.forEach(async (key) => {
            const senderEmail = key.senderEmail;
            const encryptedKey = key.encryptedKey;
            
            const privateKey = getPrivateKey();
            const decryptedKey = await decryptPrivate(privateKey, encryptedKey);
            const id = addKey(senderEmail, decryptedKey);
        });
    };

    const processNewMessages = (response) => {
        const newMessages = response.data;
        newMessages.forEach(async (message) => {
            const date = Date.parse(message.date);
            const id = addVideo(message.path, message.name, message.senderEmail, message.receiverEmail, date, false);
        });
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            receiveKeys({ jwt: userData.jwt }, { onSuccess: processReceivedKeys });
            getNewMessages({ jwt: userData.jwt }, { onSuccess: processNewMessages });
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);
}