import { Box } from "@mui/material";
import UploadFile from "../../components/uploadFile/UploadFile";
import FileStatus from "../../components/uploadFile/FileStatus";
import { useEffect, useState } from "react";
import ChatType from "../../types/chat-type";
import { useUploadFile } from "../../api/hooks/upload-file-hook";
import { useUser } from "../../providers/UserContext";
import TickOverlay from "../../components/TickOverlay";
import { useLiveQuery } from "dexie-react-hooks";
import { keysDB } from "../../indexedDB";
import { encryptAndUpload } from "../../helpers/logicHooks/Home/CurrentMessageLogic";
import decryptAESHex from "../../helpers/decryption/decryptAESHex";
import secureLocalStorage from "react-secure-storage";

interface Props{
    chat: ChatType
}

export default function CurrentMessage({
    chat
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

    const fetchedKey = useLiveQuery(
      async()=>{
        const key = await keysDB.keys
          .where('name')
          .equals(chat.email)
          .first();
        return key;
      }
    );

    const handleClearFile = ()=>{
        setFiles([])
        setIsUploadComplete(false)
    }

    const handleUpload = async () => {
      const encryptedKey = fetchedKey.value;
      const masterKey = secureLocalStorage.getItem('masterKey').toString()
      const decryptedKey = await decryptAESHex(masterKey, encryptedKey)
      const originalFile = files[0];
      await encryptAndUpload(decryptedKey, originalFile, userData, chat, setIsUploadComplete);
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