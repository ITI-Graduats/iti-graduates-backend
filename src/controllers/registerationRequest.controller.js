const { isValidObjectId } = require("mongoose");
const CustomError = require("../utils/CustomError");
const { handleIncommingImage } = require("../utils/imageKit.config");
const {
  graduateValidationSchema,
} = require("../utils/validation/graduate.validation");

const { branches } = require("../data/branches.json");
const { tracks } = require("../data/tracks.json");

class RegistrationRequestController {
  constructor(
    registrationRequestRepository,
    graduateRepository,
    branchRepository
  ) {
    this.registrationRequestRepository = registrationRequestRepository;
    this.graduateRepository = graduateRepository;
    this.branchRepository = branchRepository;
  }

  async getAllRequests() {
    return await this.registrationRequestRepository.getAllRequests();
  }

  async getRequestsByBranch(branch) {
    const existingBranch = await this.branchRepository.getBranchByName(branch);
    if (!existingBranch) throw new CustomError("No such branch exists!!", 404);

    return await this.registrationRequestRepository.getRequestsByBranch(branch);
  }

  async createRequest(requestData) {
    try {
      await graduateValidationSchema(branches, tracks).validate(requestData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    if (!branches || !branches.length)
      throw new CustomError("No such branch exists!!", 404);
    if (!tracks || !tracks.length)
      throw new CustomError("No such track exists!!", 404);

    const existingGrad = await this.graduateRepository.getGradByEmail(
      requestData.email
    );

    if (existingGrad)
      throw new CustomError(
        "You have Already Registered your data, call your ITI instructor for any required modifications",
        409
      );

    const existingRequest =
      await this.registrationRequestRepository.getRequestByEmail(
        requestData.email
      );

    if (existingRequest)
      throw new CustomError(
        "You have Already Registered your data, call your ITI instructor for any required modifications",
        409
      );

    await handleIncommingImage(requestData);

    const request = await this.registrationRequestRepository.createRequest(
      requestData
    );
    return request;
  }

  async acceptOrRejectRequest(requestId, action) {
    if (!isValidObjectId(requestId))
      throw new CustomError("Invalid request id", 400);

    if (!["accept", "reject"].includes(action))
      throw new CustomError("action has to be either accept or reject!!", 400);

    const request = await this.registrationRequestRepository.getRequestById(
      requestId
    );
    if (!request) throw new CustomError("No such request exists", 404);

    const { _id, createdAt, updatedAt, __v, ...requestBody } = request._doc;

    if (action === "accept") {
      const existingGrad = await this.graduateRepository.getGradByEmail(
        requestBody.email
      );

      if (existingGrad)
        throw new CustomError(
          `${existingGrad.fullName} has already registered his data`,
          409
        );

      await this.graduateRepository.createGrad(requestBody);
    }

    return await this.registrationRequestRepository.deleteRequest(requestId);
  }
}

module.exports = RegistrationRequestController;
