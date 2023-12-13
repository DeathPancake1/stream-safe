import { useMutation, useQueryClient } from "react-query"
import authService from "../services/auth-service"
import SignupType from "../../types/signup-type"

const useSignup = ()=>{
    const queryClient = useQueryClient()
    return useMutation(
        (data: SignupType)=>{
            return authService.signup(data)
        }
    )
}

export {
    useSignup
}