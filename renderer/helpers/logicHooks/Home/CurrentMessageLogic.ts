import encryptAES from "../../encryption/encryptAES";
import { addVideo } from "../../../indexedDB";

export const encryptAndUpload = async (key, originalFile: File, userData, chat, setUploadProgress) => {
  try {
    const { iv } = await encryptAES(key, originalFile.path, userData.email, chat.email, originalFile.name, process.env.API_URL+'/files/upload', process.env.API_KEY, userData.jwt, originalFile.type);
    const now = Date.now();
    setUploadProgress
    addVideo('', originalFile.name+'.enc', userData.email, chat.email, now, true, iv, originalFile.type)

  } catch (error) {
    console.error('Error handling upload:', error.message);
  }
};