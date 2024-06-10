import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class PhotoService {

    /**
     *POST channel/createChannel
    * @returns
    */
    async getPhotoPathById(data: {photoId: string,jwt: string}) {
        try{
            axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
            const res = await axios.post(`${process.env.API_URL}/photos/getPhotoPathById`, 
            {
                id:data.photoId
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
     *POST channel/createChannel
    * @returns
    */
     async getPhotoByPath(data: {photoPath: string,jwt: string}) {
        try{
            axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
            const res = await axios.post(`${process.env.API_URL}/photos/getPhotoByPath`, 
            {
                path:data.photoPath
            },{responseType: 'blob'});
            return res;
        }catch(error){
            return {
                status: 401,
                data: ''
            }
        }
    
    }

}
export default new PhotoService();