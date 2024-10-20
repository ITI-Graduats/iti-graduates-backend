const Queue = require("bull");
const { uploadToImageKit } = require("../utils/imageKit.config");

const imageUploadQueue = new Queue("imageUpload");

imageUploadQueue.process(async (job) => {
  const { personalPhotoFile, requestData } = job.data;
  const imageKitResponse = await uploadToImageKit(
    personalPhotoFile,
    personalPhotoFile.originalname,
    "personal_photos"
  );
  requestData.personalPhoto = imageKitResponse.url;
  requestData.personalPhotoFileId = imageKitResponse.fileId;
  await updateRegistrationRequest(requestData);
});

module.exports = imageUploadQueue;
