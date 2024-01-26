import { useMutation } from "react-query"
import keyService from "../services/key-service"


const useCheckConversationKey = ()=>{
    return useMutation(
        async (data: {email: string, jwt: string})=>{
            return await keyService.checkConversationKey(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useExchangeSymmetric = ()=>{
    return useMutation(
        async (data: {email: string, key: string, jwt: string})=>{
            return await keyService.exchangeSymmetric(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useReceiverSeen = () => {
    return useMutation(
        async (data: {jwt: string})=>{
            return await keyService.receiverSeen(data.jwt)
        },
        {
            onSuccess: (response) =>{

            }
        }
    )
};

export {
    useCheckConversationKey,
    useExchangeSymmetric,
    useReceiverSeen
}