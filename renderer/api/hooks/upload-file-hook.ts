import { useMutation } from "react-query"
import uploadFileService from "../services/upload-file-service"

const useUploadFile = ()=>{
    return useMutation(
        async (data: {senderEmail: string, receiverEmail : string, name: string, file:File, jwt: string})=>{
            return await uploadFileService.uploadFile(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useUploadFile,
}