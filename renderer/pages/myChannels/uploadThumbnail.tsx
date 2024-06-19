import { Box } from "@mui/material"
import UploadFile from "../../components/uploadFile/UploadFile";
import FileStatus from "../../components/uploadFile/FileStatus"
import { useEffect, useState } from "react";

interface Props {
  setSelectedFile: (data: File) => void
}

export default function UploadThumbnail({setSelectedFile}: Props){
    const [files, setFiles] = useState<File[]>([])
    const imageTypes = ["image/jpeg", "image/png"]

    const handleClearFile = ()=>{
        setFiles([])
    }

    const handleUpload = async () => {
      setFiles([])
    };

    useEffect(()=>{
      if(files.length){
        setSelectedFile(files[0])
      }
    }, [files])

    return (
        <Box>
          {
            files.length === 0?
            <UploadFile 
              fileList={files} 
              setFiles={setFiles}
              maxSize={1024 * 1024 * 2000} // 2000 MB
              allowedTypes={
                imageTypes
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
              fileType="thumbnail"
            />
          }
        </Box>
      )
}