import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class MessagesService {

  /**
   *POST files/deliveredVideos
   * @returns
   */
  async getNewMessages(data: {jwt: string}) {
    try{
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = await axios.get(`${process.env.API_URL}/files/deliveredVideos`);
      return res;
    }catch(error){
      return {
          status: 400,
          data: ''
          }
    }
    
  }

}

export default new MessagesService();