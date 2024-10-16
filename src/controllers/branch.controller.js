const { isValidObjectId } = require("mongoose");
const { redisClient } = require("../config/redis");
const cacheResource = require("../utils/cacheResource");
const CustomError = require("../utils/CustomError");
const {
  branchValidationSchema,
  updateBranchValidationSchema,
} = require("../utils/validation/branch.validation");

class BranchController {
  constructor(branchRepository) {
    this.branchRepository = branchRepository;
  }

  async getAllBranches() {
    if (redisClient.isReady) {
      if (await redisClient.exists("branches")) {
        const cacheBranches = await redisClient.zRange("branches", 0, -1);
        return cacheBranches.map((branch) => JSON.parse(branch));
      }

      const branches = await cacheResource(
        redisClient,
        "branches",
        this.branchRepository.getAllBranches,
      );
      return branches;
    }
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
      branchData.name,
    );
    if (existingBranch) throw new CustomError("Branch already exists", 409);

    const addedBranch = await this.branchRepository.addBranch(branchData);

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "branches",
        this.branchRepository.getAllBranches,
      );

    return addedBranch;
  }

  async updateBranch(id, branchData) {
    if (!isValidObjectId(id)) throw new CustomError("Invalid branch id", 400);

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

    const updatedBranch = await this.branchRepository.updateBranch(
      id,
      branchData,
    );

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "branches",
        this.branchRepository.getAllBranches,
      );

    return updatedBranch;
  }

  async deleteBranch(id) {
    if (!isValidObjectId(id)) throw new CustomError("Invalid branch id", 400);

    const deletedBranch = await this.branchRepository.deleteBranch(id);
    if (!deletedBranch) throw new CustomError("Branch not found", 404);

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "branches",
        this.branchRepository.getAllBranches,
      );

    return deletedBranch;
  }
}

module.exports = BranchController;
