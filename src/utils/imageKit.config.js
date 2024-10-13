const ImageKit = require("imagekit");
const CustomError = require("../utils/CustomError");
require("dotenv").config();

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = (file, fileName, folder) => {
  return new Promise((resolve, reject) => {
    imageKit.upload(
      {
        file: file.buffer,
        fileName: fileName,
        folder: folder,
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

const deleteFromImageKit = (fileId) => {
  return new Promise((resolve, reject) => {
    imageKit.deleteFile(fileId, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateImageInImageKit = async (
  oldFileId,
  newFile,
  newFileName,
  folder
) => {
  await deleteFromImageKit(oldFileId);
  return await uploadToImageKit(newFile, newFileName, folder);
};

const handleIncommingImage = async (requestData) => {
  if (
    !requestData.personalPhoto ||
    !requestData.personalPhoto.personalPhoto ||
    requestData.personalPhoto.personalPhoto.length === 0
  ) {
    throw new CustomError("Personal Photo is required", 400);
  }
  const personalPhotoFile = requestData.personalPhoto.personalPhoto[0];
  const imageKitResponse = await uploadToImageKit(
    personalPhotoFile,
    personalPhotoFile.originalname,
    "personal_photos"
  );
  if (!imageKitResponse || !imageKitResponse.url) {
    throw new CustomError("Image upload failed", 500);
  }
  requestData.personalPhoto = imageKitResponse.url;
  requestData.personalPhotoFileId = imageKitResponse.fileId;
};

module.exports = {
  uploadToImageKit,
  deleteFromImageKit,
  updateImageInImageKit,
  handleIncommingImage,
};
