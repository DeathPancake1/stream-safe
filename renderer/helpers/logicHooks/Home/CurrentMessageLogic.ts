import encryptAES from "../../encryption/encryptAES";
import { addVideo } from "../../../indexedDB";

export const encryptAndUpload = async (key, originalFile, userData, chat, uploadFile, setUploadProgress) => {
  try {
    const {encryptedFileContent, iv} = await encryptAES(key, originalFile.path, userData.email, chat.email, originalFile.name);
    const encryptedBlob = new Blob([encryptedFileContent], { type: originalFile.type });
    const encryptedFile = new File([encryptedBlob], originalFile.name + '.enc', {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

    uploadFile(
      {
        senderEmail: userData.email,
        receiverEmail: chat.email,
        name: encryptedFile.name,
        file: encryptedFile,
        jwt: userData.jwt,
        iv: iv,
        type: originalFile.type,
        setUploadProgress: setUploadProgress,
      },
      {
        onSuccess: (response)=>{
          const now = Date.now();
          addVideo(encryptedFile.path, encryptedFile.name, userData.email, chat.email, now, true, iv, originalFile.type)
        }
      }
    );


  } catch (error) {
    console.error('Error handling upload:', error.message);
  }
};