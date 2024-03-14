import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class ChannelService {

  /**
   *POST channel/createChannel
   * @returns
   */
  async createChannel(data: {title: string, description: string, private: boolean, jwt: string}) {
    try{
        axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
        const res = await axios.post(`${process.env.API_URL}/channel/createChannel`, 
        {
            title: data.title,
            description: data.description,
            private: data.private,
        });
        return res;
    }catch(error){
        return {
            status: 401,
            data: ''
        }
    }
    
  }

  /**
   *POST channel/addMembers
   * @returns
   */
   async addMembers(data: {channelId: string, newMembers: string[], jwt: string}) {
    try{
        axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
        const res = await axios.post(`${process.env.API_URL}/channel/addMembers`, 
        {
            channelId: data.channelId,
            newMemberEmail: data.newMembers,
        });
        return res;
    }catch(error){
        return {
            status: 401,
            data: ''
        }
    }
    
  }

  /**
   *POST channel/getMessagesFromChannel
   * @returns
   */
   async getMessagesFromChannel(data: {channelId: string, jwt: string}) {
    try{
        axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
        const res = await axios.post(`${process.env.API_URL}/channelFiles/getMessagesFromChannel`, 
        {
            channelId: data.channelId,
        });
        return res;
    }catch(error){
        return {
            status: 401,
            data: ''
        }
    }
    
  }

}

export default new ChannelService();