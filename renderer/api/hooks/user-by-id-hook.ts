import { useMutation } from "react-query"
import UserByIdService from "../services/user-by-id-service"


const useUserById = () =>{
    return useMutation(
        async (data:  {ownerId: number,jwt: string})=>{
            return await UserByIdService.getUserById(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useUserById
}