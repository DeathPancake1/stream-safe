import { addVideo } from "../../../indexedDB";
import { addChannelVideo } from "../../../indexedDB";
import encryptAESChannel from "../../encryption/encryptAESChannel";

export const channelEncryptAndUpload = async (key, originalFile: File, userData, chatName, setUploadProgress) => {
  try {
    const { iv } = await encryptAESChannel(key, originalFile.path, chatName, originalFile.name, process.env.API_URL+'/channelFiles/upload', process.env.API_KEY, userData.jwt, originalFile.type);
    const now = Date.now();
    setUploadProgress
    addChannelVideo('', originalFile.name+'.enc', chatName, now, true, iv, originalFile.type)

  } catch (error) {
    console.error('Error handling upload:', error.message);
  }
};