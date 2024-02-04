import { useMutation } from "react-query"
import downloadFileService from "../services/download-file-service"

const useDownloadFile = ()=>{
    return useMutation(
        async (data: {
            jwt: string,
            path: string,
            setDownloadProgress: (progress: number)=>void
        })=>{
            return downloadFileService.downloadFile(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useDownloadFile,
}