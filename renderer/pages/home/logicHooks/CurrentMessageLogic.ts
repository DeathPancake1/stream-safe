import encryptAES from "../../../helpers/encryption/encryptAES";

export const encryptAndUpload = async (key, originalFile, userData, chat, uploadFile, setUploadProgress) => {
  try {
    const encryptedArrayBuffer = await encryptAES(key, originalFile.path, userData.email, chat.email, originalFile.name);
    const encryptedBlob = new Blob([encryptedArrayBuffer], { type: originalFile.type });
    const encryptedFile = new File([encryptedBlob], originalFile.name + '.enc', {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

    uploadFile({
      senderEmail: userData.email,
      receiverEmail: chat.email,
      name: encryptedFile.name,
      file: encryptedFile,
      jwt: userData.jwt,
      setUploadProgress: setUploadProgress,
    });

  } catch (error) {
    console.error('Error handling upload:', error.message);
  }
};