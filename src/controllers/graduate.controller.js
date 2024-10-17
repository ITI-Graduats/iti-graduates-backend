const CustomError = require("../utils/CustomError");
const {
  graduateValidationSchema,
  updateGraduateValidationSchema,
} = require("../utils/validation/graduate.validation");
const { branches } = require("../data/branches.json");
const { tracks } = require("../data/tracks.json");
const { escapeRegex } = require("../utils/helpers");

class graduateController {
  constructor(graduateRepository, branchRepository) {
    this.graduateRepository = graduateRepository;
    this.branchRepository = branchRepository;
  }

  async getFilteredGrads(
    page,
    limit,
    fullName,
    cityOfBirth,
    branch,
    itiGraduationYear,
    preferredTeachingBranches,
    interestedInTeaching
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    if (fullName) {
      query.fullName = { $regex: escapeRegex(fullName), $options: "i" };
    }
    if (cityOfBirth) query.cityOfBirth = cityOfBirth;
    if (branch) query.branch = branch;
    if (itiGraduationYear) query.itiGraduationYear = itiGraduationYear;
    if (preferredTeachingBranches)
      query.preferredTeachingBranches = { $in: preferredTeachingBranches };
    if (interestedInTeaching) query.interestedInTeaching = interestedInTeaching;

    return await this.graduateRepository.getFilteredGrads(
      parseInt(limit),
      skip,
      query
    );
  }

  async getGradsByBranch(branchId) {
    const branch = await this.branchRepository.getBranchById(branchId);
    if (!branch) throw new CustomError("No such branch exists!!", 404);
    const { name: branchName } = branch;
    return await this.graduateRepository.getGradsByBranch(branchName);
  }

  async createGrad(graduateData) {
    const branchNames = await this.branchRepository.getAllBranches();
    delete graduateData._id;
    try {
      await graduateValidationSchema(branches, tracks).validate(graduateData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }
    if (!branchNames || !branchNames.length)
      throw new CustomError("No such branch exists!!", 404);

    const existingGrad = await this.graduateRepository.getGradByEmail(
      graduateData.email
    );
    if (existingGrad) throw new CustomError("Email already exists", 409);

    return await this.graduateRepository.createGrad(graduateData);
  }

  async updateGrad(id, graduateData) {
    try {
      await updateGraduateValidationSchema(branches, tracks).validate(
        graduateData,
        {
          abortEarly: false,
          stripUnknown: false,
        }
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
  async getDashboardData() {
    const branches = await this.branchRepository.getAllBranches();
    const graduateData = await Promise.all(
      branches.map(async (branch) => {
        const graduates = await this.graduateRepository.getGradsByBranch(
          branch.name
        );
        return {
          branch: branch.name,
          graduates: graduates.length,
        };
      })
    );
    return graduateData;
  }

  //   async getBranches() {
  //     const branches = await this.branchRepository.getAllBranches();
  //     const branchNames = branches?.map((branch) => branch.name);
  //     return branchNames;
  //   }
}

module.exports = graduateController;
