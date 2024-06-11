import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class MyChannelsService {
   
     async getOwnedChannels(data: {jwt: string}){
        try{
           axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
           const res = await axios.post(`${process.env.API_URL}/user/getOwnedChannels`);
           return res;
       }catch(error){
           return {
               status: 401,
               data: ''
           }
       }
   }
   async getSubscribedChannels(data: {jwt: string}){
    try{
       axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
       const res = await axios.post(`${process.env.API_URL}/user/getsubscribedChannels`);
       return res;
   }catch(error){
       return {
           status: 401,
           data: ''
       }
   }
}
}
export default new MyChannelsService();