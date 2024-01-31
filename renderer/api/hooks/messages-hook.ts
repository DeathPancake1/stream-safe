import { useMutation } from "react-query"
import messagesService from "../services/messages-service"


const useGetNewMessages = ()=>{
    return useMutation(
        async (data: {jwt: string})=>{
            return await messagesService.getNewMessages(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useGetNewMessages,
}