import Looks5Icon from '@mui/icons-material/Looks5';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks3Icon from '@mui/icons-material/Looks3';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import { useUser } from "../../providers/UserContext";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect, useState } from "react";
import { useReceiverSeen } from "../../api/hooks/key-hook";
import { useGetNewMessages } from "../../api/hooks/messages-hook";
import formatPrivateKey from "../../helpers/keyExchange/formatPrivate";
import secureLocalStorage from "react-secure-storage";
import decryptPrivate from "../../helpers/keyExchange/decryptPrivate";
import { addKey, addVideo } from "../../indexedDB";
import { Fab } from '@mui/material';

export default function RefreshButton(){
    const [refreshCountdown, setRefreshCountdown] = useState<number>(0);
    const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  
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
          const id = addKey(senderEmail, decryptedKey, 'user');
      });
    };
  
    const processNewMessages = (response) => {
      const newMessages = response.data;
      newMessages.forEach(async (message) => {
          const date = Date.parse(message.sentDate);
          const id = addVideo(message.path, message.name, message.senderEmail, message.receiverEmail, date, false, message.iv, message.type);
      });
    };
  
  const handleRefresh = () => {
    setIsRefreshDisabled(true);
    setRefreshCountdown(5); // Set the countdown duration in seconds
  
    // Start countdown
    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prevCount) => prevCount - 1);
    }, 1000);
  
    // Trigger API calls after refresh button click
    receiveKeys({ jwt: userData.jwt }, { onSuccess: processReceivedKeys });
    getNewMessages({ jwt: userData.jwt }, { onSuccess: processNewMessages });
  
    // Stop countdown after the specified duration
    setTimeout(() => {
      clearInterval(countdownInterval);
      setIsRefreshDisabled(false);
    }, 5000); // 5000 milliseconds (5 seconds) in this example
    };
  
    const refreshIcon = (refreshCountdown) => {
      let componentToRender;
    
      switch (refreshCountdown) {
        case 5:
          componentToRender = <Looks5Icon />
          break;
        case 4:
          componentToRender = <Looks4Icon />
          break;
        case 3:
          componentToRender = <Looks3Icon />
        case 2:
          componentToRender = <LooksTwoIcon />
          break;
        case 1:
          componentToRender = <LooksOneIcon />
          break;
        default:
          componentToRender = <RefreshIcon />
      }
    
      return componentToRender;
    };
    return (
        <Fab
            disabled={isRefreshDisabled}
            size="small"
            color="secondary"
            aria-label="refresh"
            sx={{
            boxShadow: 'none'
            }}
            onClick={handleRefresh}
        >
            {refreshIcon(refreshCountdown)}
        </Fab>
    )
  
}