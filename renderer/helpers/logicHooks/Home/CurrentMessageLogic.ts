import encryptAES from "../../encryption/encryptAES";
import { addVideo } from "../../../indexedDB";

export const encryptAndUpload = async (key, originalFile, userData, chat, uploadFile, setUploadProgress) => {
  try {
    console.log('test')
    const encryptedFile = await encryptAES(key, originalFile.path, userData.email, chat.email, originalFile.name);
    console.log(encryptedFile)
    // const encryptedBlob = new Blob([encryptedArrayBuffer], { type: originalFile.type });
    // const encryptedFile = new File([encryptedBlob], originalFile.name + '.enc', {
    //   type: originalFile.type,
    //   lastModified: originalFile.lastModified,
    // });

    // uploadFile(
    //   {
    //     senderEmail: userData.email,
    //     receiverEmail: chat.email,
    //     name: encryptedFile.name,
    //     file: encryptedFile,
    //     jwt: userData.jwt,
    //     setUploadProgress: setUploadProgress,
    //   },
    //   {
    //     onSuccess: (response)=>{
    //       const now = Date.now();
    //       addVideo(encryptedFile.path, encryptedFile.name, userData.email, chat.email, now, true)
    //     }
    //   }
    // );


  } catch (error) {
    console.error('Error handling upload:', error.message);
  }
};