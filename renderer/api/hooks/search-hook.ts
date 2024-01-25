import { useMutation } from "react-query"
import searchService from "../services/search-service"


const useFindEmail = ()=>{
    return useMutation(
        async (data: {email: string, jwt: string})=>{
            return await searchService.findEmail(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useFindEmail,
}