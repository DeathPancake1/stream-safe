import { Box, Divider, Typography, Button } from "@mui/material";
import Welcome from "../../components/auth/Welcome";
import ChatBody from "./ChatBody";
import UploadFile from "../../components/uploadFile/UploadFile";
import { useState } from "react";

interface Props {
  firstname?: string;
  lastname?: string;
  email?: string;
}

export default function Chat({
  firstname = "",
  lastname = "",
  email = "",
}: Props) {
  const [files, setFiles] = useState<File[]>([])
  
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {email ? (
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
                <Typography fontSize={24}>{firstname + " " + lastname}</Typography>
                <Typography fontSize={12}>{email}</Typography>
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
                <ChatBody />
            </Box>

            {/* Divider */}
            <Divider />

            {/* Button to upload a file */}
            <UploadFile fileList={files} setFiles={setFiles}/>
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
