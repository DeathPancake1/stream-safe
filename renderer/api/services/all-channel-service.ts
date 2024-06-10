import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class AllChannelService {
    /**
     *POST channel/getMembers
    * @returns
    */
     async getAllChannels(data: {jwt: string}){
        try{
           axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
           const res = await axios.post(`${process.env.API_URL}/channel/getAllChannels`);
           return res;
       }catch(error){
           return {
               status: 401,
               data: ''
           }
       }
   }
}
export default new AllChannelService();