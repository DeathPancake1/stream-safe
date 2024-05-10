import { useMutation } from "react-query"
import photoService from "../services/photo-service"


const useGetPhotoPathById = ()=>{
    return useMutation(
        async (data: {photoId: number,jwt: string})=>{
            return await photoService.getPhotoPathById(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

const useGetPhotoByPath = ()=>{
    return useMutation(
        async (data: {photoPath: string,jwt: string})=>{
            return await photoService.getPhotoByPath(data)
        },
        {
            onSuccess: (response)=>{
                
            }
        }
    )
}

export{
    useGetPhotoPathById,
    useGetPhotoByPath
}