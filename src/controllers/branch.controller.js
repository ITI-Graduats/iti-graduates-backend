const CustomError = require("../utils/CustomError");
const {
  branchValidationSchema,
  updateBranchValidationSchema,
} = require("../utils/validation/branch.validation");

class BranchController {
  branchRepository;

  constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async getAllBranches() {
    return await this.branchRepository.getAllBranches();
  }

  async addBranch(branchData) {
    try {
      await branchValidationSchema.validate(branchData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }
    
    const existingBranch = await this.branchRepository.getBranchByName(
      branchData.name
    );
    if (existingBranch) throw new CustomError("Branch already exists", 409);

    return await this.branchRepository.addBranch(branchData);
  }

  async updateBranch(id, branchData) {
    try {
      await updateBranchValidationSchema.validate(branchData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }
    const existingBranch = await this.branchRepository.getBranchById(id);
    if (!existingBranch) throw new CustomError("Branch not found", 404);
    return await this.branchRepository.updateBranch(id, branchData);
  }

  async deleteBranch(id) {
    const deletedBranch = await this.branchRepository.deleteBranch(id);
    if (!deletedBranch) throw new CustomError("Branch not found", 404);
    return deletedBranch;
  }
}

module.exports = BranchController;
