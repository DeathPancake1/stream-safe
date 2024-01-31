import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class KeyService {

  /**
   *POST exchanged-keys/checkConversationKey
   * @returns
   */
  async checkConversationKey(data: {email: string, jwt: string}) {
    try{
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = await axios.post(`${process.env.API_URL}/exchanged-keys/checkConversationKey`, {email: data.email});
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
          }
    }
    
  }


  /**
   *POST exchanged-keys/exchangeSymmetric
   * @returns
   */
   async exchangeSymmetric(data: {email: string, key:string, jwt: string}) {
    try{
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = await axios.post(`${process.env.API_URL}/exchanged-keys/exchangeSymmetric`, {email: data.email, key: data.key});
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
          }
    }
    
  }

    /**
     *GET exchanged-keys/receiverSeen
    * @returns
    */
    receiverSeen(jwt: string) {
        axios.defaults.headers.common['Authorization']=`Bearer ${jwt}`
        const res = axios.get(`${process.env.API_URL}/exchanged-keys/receiverDelivered`);
        return res
    }
    

}

export default new KeyService();