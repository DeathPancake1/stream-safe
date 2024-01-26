import { useMutation } from "react-query"
import searchService from "../services/search-service"


const useSearchUser = ()=>{
    return useMutation(
        async (data: {email: string, jwt: string})=>{
            return await searchService.searchUser(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useSearchUser,
}