const { isValidObjectId } = require("mongoose");
const CustomError = require("../utils/CustomError");
const { handleIncommingImage } = require("../utils/imageKit.config");
const {
  graduateValidationSchema,
} = require("../utils/validation/graduate.validation");

class RegistrationRequestController {
  constructor(registrationRequestRepository, graduateRepository) {
    this.registrationRequestRepository = registrationRequestRepository;
    this.graduateRepository = graduateRepository;
  }

  async getAllRequests(query) {
    return await this.registrationRequestRepository.getAllRequests(query);
  }

  async createRequest(requestData) {
    try {
      await graduateValidationSchema.validate(requestData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }
    const existingRequest =
      await this.registrationRequestRepository.getRequestByEmail(
        requestData.email
      );
    if (existingRequest) throw new CustomError("Email already exists", 409);

    await handleIncommingImage(requestData);

    const request = await this.registrationRequestRepository.createRequest(
      requestData
    );
    return request;
  }

  async acceptRequest(requestId) {
    if (!isValidObjectId(requestId))
      throw new CustomError("Invalid request id", 400);

    const request = await this.registrationRequestRepository.getRequestById(
      requestId
    );
    if (!request) throw new CustomError("No such request exists", 404);

    const graduate = await this.graduateRepository.createGraduate({
      fullName: request.fullName,
      email: request.email,
      phoneNumber: request.phoneNumber,
      branch: request.branch,
      track: request.track,
    });

    await this.registrationRequestRepository.deleteRequest(requestId);

    return graduate;
  }

  async declineRequest(requestId) {
    if (!isValidObjectId(requestId))
      throw new CustomError("Invalid request id", 400);

    const declinedRequest =
      await this.registrationRequestRepository.declineRequest(requestId);
    if (!declinedRequest) throw new CustomError("No such request exists", 404);

    return declinedRequest;
  }

  async deleteRequest(requestId) {
    if (!isValidObjectId(requestId))
      throw new CustomError("Invalid request id", 400);

    const deletedRequest =
      await this.registrationRequestRepository.deleteRequest(requestId);
    if (!deletedRequest) throw new CustomError("No such request exists", 404);

    return deletedRequest;
  }
}

module.exports = RegistrationRequestController;
