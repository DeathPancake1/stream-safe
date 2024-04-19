import { useMutation } from "react-query"
import channelService from "../services/channel-service"


const useCreateChannel = ()=>{
    return useMutation(
        async (data: {title: string, description: string, private: boolean, jwt: string})=>{
            return await channelService.createChannel(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useCreateChannel
}