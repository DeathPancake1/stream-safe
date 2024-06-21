import { useMutation } from "react-query"
import channelRequestService from "../services/request-service"


const useGetChannelRequests = () =>{
    return useMutation(
        async (data: {jwt: string})=>{
            return await channelRequestService.getChannelRequests(data.jwt)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useCreateChannelRequests = () =>{
    return useMutation(
        async (data: {jwt: string, channelId: string})=>{
            return await channelRequestService.createChannelRequests(data.jwt, data.channelId)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useRespondChannelRequest = () =>{
    return useMutation(
        async (data: {jwt: string, requestId: number, response: boolean})=>{
            return await channelRequestService.respondChannelRequest(data.jwt, data.requestId, data.response)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useGetChannelRequests,
    useCreateChannelRequests,
    useRespondChannelRequest
}