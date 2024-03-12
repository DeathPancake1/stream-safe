import { useMutation } from "react-query"
import authService from "../services/auth-service"
import SignupType from "../../types/signup-type"
import SigninType from "../../types/signin-type"
import SendVerMail from "../../types/send-verify"
import receiveOTP from "../../types/receive-otp"
import changePassword from "../../types/change-password"

const useSignup = ()=>{
    return useMutation(
        async (data: SignupType)=>{
            return await authService.signup(data)
        },
        {
            onSuccess: (response)=>{
                
            }
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

const useSendVer = ()=>{
    return useMutation(
        async (data: SendVerMail)=>{
            return await authService.sendVerMail(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useReceiveOTP = ()=>{
    return useMutation(
        async (data: receiveOTP)=>{
            return await authService.receiveOTP(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useChangePassword = ()=>{
    return useMutation(
        async (data: changePassword)=>{
            return await authService.changePassword(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export {
    useSignup,
    useSignin,
    useSendVer,
    useReceiveOTP,
    useChangePassword
}