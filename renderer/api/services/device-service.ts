import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class DeviceService {

  /**
   *POST device/getId
   * @returns
   */
  async genDeviceId(data: {publicKey: string, jwt: string}) {
    try{
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = await axios.post(`${process.env.API_URL}/device/getId`, data.publicKey);
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
          }
    }
    
  }

  /**
   *GET device/isLocked
   * @returns
   */
  getIsLocked(jwt: string) {
    axios.defaults.headers.common['Authorization']=`Bearer ${jwt}`
    const res = axios.get(`${process.env.API_URL}/device/isLocked`);
    return res
  }

}

export default new DeviceService();