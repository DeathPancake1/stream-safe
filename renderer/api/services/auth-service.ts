import axios from "axios";
import SignupType from '../../types/signup-type'
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
    return res;
  }

}

export default new AuthService();