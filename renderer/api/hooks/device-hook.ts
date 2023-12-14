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

const useCheckId = ()=>{
    return useMutation(
        async (data: {deviceId: string, jwt: string})=>{
            return await deviceService.checkId(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useCheckLocked = () => {
    return useMutation(
        async (data: {jwt: string})=>{
            return await deviceService.getIsLocked(data.jwt)
        },
        {
            onSuccess: (response) =>{

            }
        }
    )
};

export {
    useGetId,
    useCheckLocked,
    useCheckId
}