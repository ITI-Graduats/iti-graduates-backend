const Branch = require("../models/branch.model");

class BranchRepository {
  async getAllBranches() {
    return await Branch.find({});
  }

  async getBranchById(id) {
    return await Branch.findById(id);
  }

  async addBranch(branchData) {
    const branch = new Branch(branchData);
    return await branch.save();
  }

  async updateBranch(id, branchData) {
    return await Branch.findByIdAndUpdate(id, branchData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteBranch(id) {
    return await Branch.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = BranchRepository;
