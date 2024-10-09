const CustomError = require("../utils/CustomError");
const { branchValidationSchema, updateBranchValidationSchema } = require("../utils/validation/branch.validation");

class BranchController {
  branchRepository;

  constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async getAllBranches() {
    return await this.branchRepository.getAllBranches();
  }

  async addBranch(branchData) {
    await this.validateData(branchValidationSchema, branchData);
    return await this.branchRepository.addBranch(branchData);
  }

  async updateBranch(id, branchData) {
    await this.validateData(updateBranchValidationSchema, branchData);
    const existingBranch = await this.branchRepository.getBranchById(id);
    if (!existingBranch) throw new CustomError("Branch not found", 404);
    return await this.branchRepository.updateBranch(id, branchData);
  }

  async deleteBranch(id) {
    const deletedBranch = await this.branchRepository.deleteBranch(id);
    if (!deletedBranch) throw new CustomError("Branch not found", 404);
    return deletedBranch;
  }

  async validateData(schema, data) {
    const isValid = await schema.isValid(data, { abortEarly: false });
    if (!isValid) {
      const errors = await schema.validate(data, { abortEarly: false }).catch((err) => err.errors);
      throw new CustomError(errors.join(", "), 400);
    }
  }
}

module.exports = BranchController;
