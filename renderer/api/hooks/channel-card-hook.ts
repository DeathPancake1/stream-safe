import { useMutation } from "react-query"
import allChannelService from "../services/all-channel-service"

type Channel = {
    id: string;
    title: string;
    subheader: string;
    image: string;
    description: string;
  };
const useAllChannels = () =>{
    return useMutation(
        async (data: {jwt: string})=>{
            return await allChannelService.getAllChannels(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useAllChannels
}