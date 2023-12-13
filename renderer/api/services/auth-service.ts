import axios from "axios";
import SignupType from '../../types/signup-type'
import SigninType from '../../types/signin-type'
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class AuthService {

  /**
   *POST signup
   * @returns
   */
  async signup(data: SignupType) {
    const res = await axios.post(`${process.env.API_URL}/auth/register`, data);
    return res.data;
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

}

export default new AuthService();