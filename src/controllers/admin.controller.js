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
        const branches = (await this.branchRepository.getAllBranches())?.map(
            (branch) => branch.name
        );
        try {
            await createAdminValidationSchema(branches).validate(adminData, {
                abortEarly: false,
                stripUnknown: false,
            });
        } catch (err) {
            const errorMessages = err.errors;
            console.log(err.errors);
            throw new CustomError(
                errorMessages.join(", ").replace(/"/g, ""),
                422
            );
        }

        const existingAdmin = await this.adminRepository.getAdminByEmail(
            adminData.email
        );
        if (existingAdmin) throw new CustomError("Email already exists", 409);

        const { branch: branchName } = adminData;

        const existingBranch = await this.branchRepository.getBranchByName(
            branchName
        );
        if (!existingBranch)
            throw new CustomError("No such branch exists!!", 400);
        adminData["branch"] = existingBranch._id;

        const admin = await this.adminRepository.createAdmin(adminData);
        return admin;
    }

    async updateAdmin(adminId, adminData) {
        if (!isValidObjectId(adminId))
            throw new CustomError("Invalid admin id!!", 400);

        const branches = (await this.branchRepository.getAllBranches())?.map(
            (branch) => branch.name
        );

        try {
            await updateAdminValidationSchema(branches).validate(adminData, {
                abortEarly: false,
                stripUnknown: false,
            });
        } catch (err) {
            const errorMessages = err.errors;
            throw new CustomError(
                errorMessages.join(", ").replace(/"/g, ""),
                422
            );
        }

        if ("branch" in adminData) {
            const { branch: branchName } = adminData;

            const existingBranch = await this.branchRepository.getBranchByName(
                branchName
            );
            if (!existingBranch)
                throw new CustomError("No such branch exists!!", 400);
            adminData["branch"] = existingBranch._id;
        }
        
        const updatedAdmin = await this.adminRepository.updateAdmin(
            adminId,
            adminData
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
}

module.exports = AdminController;
