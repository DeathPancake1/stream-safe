import axios from "axios";
import SignupType from '../../types/signup-type'
import SigninType from '../../types/signin-type'
import * as dotenv from 'dotenv'
import SendVerMail from "../../types/send-verify";
import receiveOTP from "../../types/receive-otp";
import changePassword from "../../types/change-password";

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class AuthService {

  /**
   *POST signup
   * @returns
   */
  async signup(data: SignupType) {
    try{
      const res = await axios.post(`${process.env.API_URL}/auth/register`, data);
      return res;
    }catch(error){
      return {
        status: 401,
        data: ''
      }
    }
    
  }

  /**
   *POST signin
   * @returns
   */
   async signin(data: SigninType) {
    try{
      const res = await axios.post(`${process.env.API_URL}/auth/login`, data);
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
        }
    }
    
  }

    /**
   *POST sendVerMail
   * @returns
   */
   async sendVerMail(data: SendVerMail) {
    try{
      const res = await axios.post(`${process.env.API_URL}/user/sendVerMail`, data);
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
        }
    }
    
  }


      /**
   *POST receiveOTP
   * @returns
   */
   async receiveOTP(data: receiveOTP) {
    try{
      const res = await axios.post(`${process.env.API_URL}/user/receiveOTP`, data);
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
        }
    }
  }

    /**
   *POST changePassword
   * @returns
   */
   async changePassword(data: changePassword) {
    try{
      const res = await axios.post(`${process.env.API_URL}/user/changePassword`, data);
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
        }
    }
  }

}

export default new AuthService();