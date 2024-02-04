import axios from "axios";
import * as dotenv from 'dotenv'
import { useState } from "react";

dotenv.config()
axios.defaults.headers.common['api-key']=`${process.env.API_KEY}`

class DownloadFileService {

  /**
   *POST files/downloadVideo
   * @returns
   */
  async downloadFile(data: {
    path: string
    jwt: string,
    setDownloadProgress: (progress: number)=>void
  }) {
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`
        const res = await axios.post(
            `${process.env.API_URL}/files/downloadVideo`,
            { path: data.path },
            {
                onDownloadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                data.setDownloadProgress(percentCompleted);
                },
            }
        );
        return res;
    }catch(error){
        return {
            status: 401,
            data: ''
        }
    }
    }
}

export default new DownloadFileService();