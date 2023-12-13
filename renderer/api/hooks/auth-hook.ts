import { useMutation, useQueryClient } from "react-query"
import authService from "../services/auth-service"
import SignupType from "../../types/signup-type"

const useSignup = ()=>{
    const queryClient = useQueryClient()
    return useMutation(
        async (data: SignupType)=>{
            return await authService.signup(data)
        },
        {
            onSuccess: (data)=>{
                return data
            }
        }
    )
}

export {
    useSignup
}