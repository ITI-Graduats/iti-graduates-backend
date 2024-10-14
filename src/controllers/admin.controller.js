const { isValidObjectId } = require("mongoose");
const CustomError = require("../utils/CustomError");
const {
  createAdminValidationSchema,
  updateAdminValidationSchema,
} = require("../utils/validation/admin.validation");

class AdminController {
  constructor(adminRepository, branchRepository) {
    this.adminRepository = adminRepository;
    this.branchRepository = branchRepository;
  }
  async getAllAdmins() {
    return await this.adminRepository.getAllAdmins();
  }

  async createAdmin(adminData) {
    const { branches, branchNames } = await this.getBranches();
    try {
      await createAdminValidationSchema(branchNames).validate(adminData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    const existingAdmin = await this.adminRepository.getAdminByEmail(
      adminData.email,
    );
    if (existingAdmin) throw new CustomError("Email already exists", 409);

    const { branch: adminBranchName } = adminData;

    const existingBranch = branches.find(
      (branch) => branch.name === adminBranchName,
    );

    if (!existingBranch) throw new CustomError("No such branch exists!!", 404);

    adminData["branch"] = existingBranch._id;

    const admin = await this.adminRepository.createAdmin(adminData);
    return admin;
  }

  async updateAdmin(adminId, adminData) {
    if (!isValidObjectId(adminId))
      throw new CustomError("Invalid admin id!!", 400);

    const { branches, branchNames } = await this.getBranches();

    try {
      await updateAdminValidationSchema(branchNames).validate(adminData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    if ("branch" in adminData) {
      const { branch: adminBranchName } = adminData;

      const existingBranch = branches.find(
        (branch) => branch.name === adminBranchName,
      );

      if (!existingBranch)
        throw new CustomError("No such branch exists!!", 404);

      adminData["branch"] = existingBranch._id;
    }

    const updatedAdmin = await this.adminRepository.updateAdmin(
      adminId,
      adminData,
    );
    if (!updatedAdmin) throw new CustomError("No such admin exists!!", 404);

    return updatedAdmin;
  }

  async deleteAdmin(adminId) {
    if (!isValidObjectId(adminId))
      throw new CustomError("Invalid admin id!!", 400);

    const deletedAdmin = await this.adminRepository.deleteAdmin(adminId);

    if (!deletedAdmin) throw new CustomError("No such admin exists!!", 404);

    return deletedAdmin;
  }

  async getBranches() {
    const branches = await this.branchRepository.getAllBranches();
    const branchNames = branches?.map((branch) => branch.name);
    return { branches, branchNames };
  }
}

module.exports = AdminController;
