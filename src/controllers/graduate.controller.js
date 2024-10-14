const { redisClient } = require("../config/redis");
const cacheResource = require("../utils/cacheResource");
const CustomError = require("../utils/CustomError");
const {
  updateGraduateValidationSchema,
} = require("../utils/validation/graduate.validation");

class graduateController {
  constructor(graduateRepository, branchRepository, trackRepository) {
    this.graduateRepository = graduateRepository;
    this.branchRepository = branchRepository;
    this.trackRepository = trackRepository;
  }

  async getAllGrads() {
    return await this.graduateRepository.getAllGrads();
  }

  async getGradsByBranch(branchId) {
    const branch = await this.branchRepository.getBranchById(branchId);
    if (!branch) throw new CustomError("No such branch exists!!", 404);
    const { name: branchName } = branch;
    return await this.graduateRepository.getGradsByBranch(branchName);
  }

  async updateGrad(id, graduateData) {
    const branches = await this.getCachedResource(
      "branches",
      this.branchRepository.getAllBranches,
    );
    const tracks = await this.getCachedResource(
      "tracks",
      this.trackRepository.getAllTracks,
    );
    try {
      await updateGraduateValidationSchema(branches, tracks).validate(
        graduateData,
        {
          abortEarly: false,
          stripUnknown: false,
        },
      );
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    if (!branches || !branches.length)
      throw new CustomError("No such branch exists!!", 404);
    if (!tracks || !tracks.length)
      throw new CustomError("No such track exists!!", 404);

    const existingGraduate = await this.graduateRepository.getGradById(id);
    if (!existingGraduate) throw new CustomError("Graduate not found", 404);
    return await this.graduateRepository.updateGrad(id, graduateData);
  }

  async deleteGrad(id) {
    const deletedGraduate = await this.graduateRepository.deleteGrad(id);
    if (!deletedGraduate) throw new CustomError("Graduate not found", 404);
    return deletedGraduate;
  }

  async getCachedResource(resourceName, resourceFetchFn) {
    if (await redisClient.exists(resourceName)) {
      const cachedResources = await redisClient.zRange(resourceName, 0, -1);
      return cachedResources.map(
        (cachedResource) => JSON.parse(cachedResource).name,
      );
    }

    const resources = await cacheResource(
      redisClient,
      resourceName,
      resourceFetchFn,
    );
    return resources.map((resource) => resource.name);
  }
}

module.exports = graduateController;
