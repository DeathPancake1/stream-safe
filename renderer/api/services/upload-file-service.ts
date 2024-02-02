import axios from "axios";
import * as dotenv from 'dotenv'
import { useState } from "react";

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class UploadFileService {

  /**
   *POST files/upload
   * @returns
   */
  async uploadFile(data: {
    senderEmail: string,
    receiverEmail : string,
    name: string,
    file:File,
    jwt: string,
    iv: string,
    type: string,
    setUploadProgress: (progress: number)=>void
  }) {
    try{
      let formData = new FormData();
      formData.append("senderEmail", data.senderEmail);
      formData.append("receiverEmail", data.receiverEmail);
      formData.append("name", data.name);
      formData.append("file", data.file);
      formData.append("iv", data.iv);
      formData.append("type", data.type)
      axios.defaults.headers.common['Authorization']=`Bearer ${data.jwt}`
      const res = axios.post(`${process.env.API_URL}/files/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          data.setUploadProgress(percentCompleted);
        }
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

export default new UploadFileService();