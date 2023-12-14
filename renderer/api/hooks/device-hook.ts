import { useMutation, useQuery } from "react-query"
import deviceService from "../services/device-service"


const useGetId = ()=>{
    return useMutation(
        async (data: {publicKey: string, jwt: string})=>{
            return await deviceService.genDeviceId(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useCheckLocked = (jwt: string) => {
    return useQuery(['device', deviceService.getIsLocked(jwt)], {
      enabled: !!jwt, // Only execute the query if jwt is truthy
    });
};

export {
    useGetId,
    useCheckLocked
}