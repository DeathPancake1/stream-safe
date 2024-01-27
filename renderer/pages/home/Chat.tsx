import { Box, Divider, Typography, Button } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import ChatBody from "./ChatBody";
import UploadFile from "../../components/uploadFile/UploadFile";
import { useState } from "react";
import ChatType from "../../types/chat-type";
import FileStatus from "../../components/uploadFile/FileStatus";

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
                <FileStatus file={files[0]} removeFile={()=>setFiles([])} upload={()=>console.log('not implemented')}/>
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
