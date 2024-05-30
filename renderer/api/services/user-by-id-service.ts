import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class UserByIdService {
    /**
     *POST channel/getMembers
    * @returns
    */
     async getUserById(data: {ownerId: number,jwt: string}){
        try{
           axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
           const res = await axios.post(`${process.env.API_URL}/user/getUserInfoById`, { 
            id: data.ownerId
           } );
           return res;
       }catch(error){
           return {
               status: 401,
               data: ''
           }
       }
   }
}
export default new UserByIdService();