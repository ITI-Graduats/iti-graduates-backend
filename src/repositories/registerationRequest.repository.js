const RegistrationRequest = require("../models/registerationRequest.model");

class RegistrationRequestRepository {
  async getAllRequests() {
    return await RegistrationRequest.find({});
  }

  async getRequestById(id) {
    return await RegistrationRequest.findById(id);
  }

  async getRequestByEmail(email) {
    return await RegistrationRequest.findOne({ email });
  }
  async getRequestsByBranch(branchName) {
    return await RegistrationRequest.find({
      preferredTeachingBranches: { $in: [branchName] },
    });
  }
  async createRequest(requestData) {
    const newRequest = new RegistrationRequest(requestData);
    return await newRequest.save();
  }

  async deleteRequest(id) {
    return await RegistrationRequest.findByIdAndDelete(id);
  }
}

module.exports = RegistrationRequestRepository;
