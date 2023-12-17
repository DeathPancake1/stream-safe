import { useMutation } from "react-query"
import authService from "../services/auth-service"
import SignupType from "../../types/signup-type"
import SigninType from "../../types/signin-type"

const useSignup = ()=>{
    return useMutation(
        async (data: SignupType)=>{
            return await authService.signup(data)
        },
        {

        }
    )
}

const useSignin = ()=>{
    return useMutation(
        async (data: SigninType)=>{
            return await authService.signin(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useSignup,
    useSignin
}