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

const useAddMembers = () =>{
    return useMutation(
        async (data: {channelId: string, newMembers: string[], jwt: string})=>{
            return await channelService.addMembers(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useGetMessagesFromChannel = () =>{
    return useMutation(
        async (data: {channelId: string, jwt: string})=>{
            return await channelService.getMessagesFromChannel(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useCreateChannel,
    useAddMembers,
    useGetMessagesFromChannel
}