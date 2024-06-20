import { Box } from "@mui/material";
import UploadFile from "../../components/uploadFile/UploadFile";
import FileStatus from "../../components/uploadFile/FileStatus";
import { useState } from "react";
import { useUploadFile } from "../../api/hooks/upload-file-hook";
import { useUser } from "../../providers/UserContext";
import TickOverlay from "../../components/TickOverlay";
import decryptAESHex from "../../helpers/decryption/decryptAESHex";
import secureLocalStorage from "react-secure-storage";
import ChannelType from "../../types/channel-type";
import { channelEncryptAndUpload } from "../../helpers/logicHooks/Home/ChannelCurrentMessageLogic";

interface Props{
    channel: ChannelType
}

export default function ChannelCurrentMessage({
    channel
}: Props){
    const [files, setFiles] = useState<File[]>([])
    const {mutate: uploadFile} = useUploadFile()
    const {userData, updateUser} = useUser()
    const [isUploadComplete ,setIsUploadComplete] = useState<boolean>(false)
    const videoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-matroska',
      'video/mpeg',
      'video/ogm',
      // Add more video MIME types as needed
    ]

    const handleClearFile = ()=>{
        setFiles([])
        setIsUploadComplete(false)
    }

    const handleUpload = async () => {
      const encryptedKey = channel.key;
      const masterKey = secureLocalStorage.getItem('masterKey').toString()
      const decryptedKey = await decryptAESHex(masterKey, encryptedKey)
      const originalFile = files[0];
      await channelEncryptAndUpload(decryptedKey, originalFile, userData, channel.channelId, setIsUploadComplete);
      setFiles([])
    };
    
    return (
      <Box>
        {isUploadComplete && <TickOverlay onClick={()=>handleClearFile()}/>}
        {
          files.length === 0?
          <UploadFile 
            fileList={files} 
            setFiles={setFiles}
            maxSize={1024 * 1024 * 2000} // 2000 MB
            allowedTypes={
              videoTypes
            }
          />
          :
          <FileStatus 
            file={files[0]} 
            removeFile={
              ()=>handleClearFile()
            } 
            upload={
              ()=>{
                handleUpload()
              }
            }
          />
        }
      </Box>
    )
}