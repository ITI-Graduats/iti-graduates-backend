const RegistrationRequest = require("../models/registerationRequest.model");

class RegistrationRequestRepository {
  async getAllRequests(query = {}) {
    return await RegistrationRequest.find(query);
  }

  async getRequestById(id) {
    return await RegistrationRequest.findById(id);
  }

  async getRequestByEmail(email) {
    return await RegistrationRequest.findOne({ email });
  }

  async createRequest(requestData) {
    const newRequest = new RegistrationRequest(requestData);
    return await newRequest.save();
  }

  async acceptRequest(id) {
    return await RegistrationRequest.findByIdAndUpdate(id, { status: "accepted" }, { new: true });
  }

  async declineRequest(id) {
    return await RegistrationRequest.findByIdAndUpdate(id, { status: "declined" }, { new: true });
  }

  async deleteRequest(id) {
    return await RegistrationRequest.findByIdAndDelete(id);
  }
}

module.exports = RegistrationRequestRepository;
