import { Box, Divider, Typography, Button } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import ChatBody from "./ChatBody";
import UploadFile from "../../components/uploadFile/UploadFile";
import { useState } from "react";
import ChatType from "../../types/chat-type";
import FileStatus from "../../components/uploadFile/FileStatus";
import { useUploadFile } from "../../api/hooks/upload-file-hook";
import { useUser } from "../../providers/UserContext";
import encryptAES from "../../helpers/encryption/encryptAES";
import secureLocalStorage from "react-secure-storage";

interface Props {
  chat?: ChatType
}

export default function Chat({
  chat = {
    firstname: '',
    lastname: '',
    email: '',
    publicKey: ''
  }
}: Props) {
  const [files, setFiles] = useState<File[]>([])
  const {mutate: uploadFile} = useUploadFile()
  const {userData, updateUser} = useUser()

  const fetchKey =async () => {
    const keyId = chat.email+ '-key';
    const key = await secureLocalStorage.getItem(keyId).toString()
    return key
  }

  const handleUpload = async () => {
    try {
      const key = await fetchKey();
      const originalFile = files[0];
      const originalArrayBuffer = await originalFile.arrayBuffer();
      
      // Perform encryption using your encryptAES function
      const encryptedArrayBuffer = await encryptAES(key, originalArrayBuffer);
  
      // Create a new Blob with the encrypted content
      const encryptedBlob = new Blob([encryptedArrayBuffer], { type: originalFile.type });
  
      // Create a new File with the encrypted Blob
      const encryptedFile = new File([encryptedBlob], originalFile.name + '.enc', {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
  
      // Now you can proceed with uploading the encrypted file
      uploadFile({
        senderEmail: userData.email,
        receiverEmail: chat.email,
        name: encryptedFile.name,
        file: encryptedFile,
        jwt: userData.jwt
      });
  
    } catch (error) {
      console.error('Error handling upload:', error.message);
    }
  };
  
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {chat.email ? (
        // When email exists, show the chat box
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Box>
              <Typography fontSize={24}>{chat.firstname + " " + chat.lastname}</Typography>
              <Typography fontSize={12}>{chat.email}</Typography>
              <Divider />
          </Box>
        

          {/* Display the exchanged messages */}
          <Box
              sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              width: "100%",
              }}
          >
              <ChatBody chat={chat}/>
          </Box>

          {/* Divider */}
          <Divider />

          {/* Button to upload a file */}
          {
            files.length === 0?
              <UploadFile fileList={files} setFiles={setFiles}/>
            :
              <FileStatus 
                file={files[0]} 
                removeFile={()=>setFiles([])} 
                upload={
                  ()=>{
                    handleUpload()
                  }
                }
              />
          }
            
        </Box>
      ) : (
        // When email doesn't exist, show the welcome component
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
      )}
    </Box>
  );
}
