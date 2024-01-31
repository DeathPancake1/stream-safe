import { Box, Button } from "@mui/material";
import UploadFile from "../../components/uploadFile/UploadFile";
import FileStatus from "../../components/uploadFile/FileStatus";
import { useEffect, useState } from "react";
import ChatType from "../../types/chat-type";
import encryptAES from "../../helpers/encryption/encryptAES";
import { useUploadFile } from "../../api/hooks/upload-file-hook";
import { useUser } from "../../providers/UserContext";
import TickOverlay from "../../components/TickOverlay";
import { useLiveQuery } from "dexie-react-hooks";
import { keysDB } from "../../indexedDB";

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
        try {
          const key = fetchedKey.value;
          const originalFile = files[0];
          
          // Perform encryption using your encryptAES function
          const encryptedArrayBuffer =  await encryptAES(key, originalFile.path, userData.email ,chat.email, originalFile.name);
      
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
            jwt: userData.jwt,
            setUploadProgress: setUploadProgress
          });
      
        } catch (error) {
          console.error('Error handling upload:', error.message);
        }
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