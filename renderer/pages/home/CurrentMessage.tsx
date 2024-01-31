import { Box } from "@mui/material";
import UploadFile from "../../components/uploadFile/UploadFile";
import FileStatus from "../../components/uploadFile/FileStatus";
import { useEffect, useState } from "react";
import ChatType from "../../types/chat-type";
import secureLocalStorage from "react-secure-storage";
import encryptAES from "../../helpers/encryption/encryptAES";
import { useUploadFile } from "../../api/hooks/upload-file-hook";
import { useUser } from "../../providers/UserContext";

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

    const fetchKey =async () => {
        const keyId = chat.email+ '-key';
        const key = await secureLocalStorage.getItem(keyId).toString()
        return key
    }

    const handleUpload = async () => {
        try {
          const key = await fetchKey();
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

    useEffect(()=>{
        setUploadProgress(0)
    }, files)
    
    return (
        <Box>
            {
            files.length === 0?
              <UploadFile fileList={files} setFiles={setFiles}/>
            :
              <FileStatus 
                file={files[0]} 
                removeFile={
                    ()=>{
                        setFiles([])
                        setUploadProgress(0)
                    }
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