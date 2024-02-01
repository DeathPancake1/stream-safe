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
import { encryptAndUpload } from "./logicHooks/CurrentMessageLogic";

interface Props{
    chat: ChatType
}

export default function CurrentMessage({
    chat
}: Props){
    const [files, setFiles] = useState<File[]>([])
    const {mutate: uploadFile} = useUploadFile()
    const {userData, updateUser} = useUser()
    const [uploadProgress ,setUploadProgress] = useState<number>(0)
    const [isUploadComplete ,setIsUploadComplete] = useState<boolean>(false)

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
        setUploadProgress(0)
        setIsUploadComplete(false)
    }

    const handleUpload = async () => {
      const key = fetchedKey.value;
      const originalFile = files[0];
      await encryptAndUpload(key, originalFile, userData, chat, uploadFile, setUploadProgress);
    };

    useEffect(() => {
        if (uploadProgress === 100) {
            setIsUploadComplete(true);
        }
    }, [uploadProgress]);
    
    return (
      <Box>
        {isUploadComplete && <TickOverlay onClick={()=>handleClearFile()}/>}
        {
          files.length === 0?
          <UploadFile fileList={files} setFiles={setFiles}/>
          :
          <FileStatus 
            file={files[0]} 
            removeFile={
              ()=>handleClearFile()
            } 
            uploadProgress={uploadProgress}
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