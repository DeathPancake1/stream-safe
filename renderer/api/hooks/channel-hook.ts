import { useMutation } from "react-query"
import channelService from "../services/channel-service"
import myChannels from "../../pages/myChannels"
import myChannelsService from "../services/my-channels-service"


const useCreateChannel = ()=>{
    return useMutation(
        async (data: {title: string, description: string, private: boolean, jwt: string, thumbnailPhoto: File})=>{
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
        async (data: {channelId: string, newMember: string, key: string, jwt: string})=>{
            return await channelService.addMember(data)
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

const useGetMembers = () =>{
    return useMutation(
        async (data: {channelId: string, jwt: string})=>{
            return await channelService.getMembers(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useGetChannelInfoById = () =>{
    return useMutation(
        async (data: {channelId: string,jwt: string})=>{
            return await channelService.getChannelInfoById(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useSearchAllChannels = () =>{
    return useMutation(
        async (data: {jwt: string, name: string})=>{
            return await channelService.searchAllChannels(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useGetMyChannels = () =>{
    return useMutation(
        async (data: {jwt: string})=>{
            return await myChannelsService.getMyChannels(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useCheckIfMember = () =>{
    return useMutation(
        async (data: {jwt: string, channelId: string})=>{
            return await channelService.checkIfMember(data)
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
    useGetMessagesFromChannel,
    useGetMembers,
    useGetChannelInfoById,
    useSearchAllChannels,
    useGetMyChannels,
    useCheckIfMember
}