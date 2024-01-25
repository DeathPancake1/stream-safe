import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class SearchService {

  /**
   *POST user/findEmail
   * @returns
   */
  async findEmail(data: {email: string, jwt: string}) {
    try{
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = await axios.post(`${process.env.API_URL}/user/findEmail`, {email: data.email});
      return res;
    }catch(error){
      return {
          status: 401,
          data: ''
          }
    }
    
  }

}

export default new SearchService();