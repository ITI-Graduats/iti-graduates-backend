const CustomError = require("../utils/CustomError");
const {
    graduateValidationSchema,
    updateGraduateValidationSchema,
} = require("../utils/validation/graduate.validation");

class graduateController {
    constructor(graduateRepository, branchRepository) {
        this.graduateRepository = graduateRepository;
        this.branchRepository = branchRepository;
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

    async createGrad(graduateData) {
        const branches = (await this.branchRepository.getAllBranches())?.map(
            (branch) => branch.name
        );
        try {
            await graduateValidationSchema(branches).validate(graduateData, {
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
        const existingGrad = await this.graduateRepository.getGradByEmail(
            graduateData.email
        );
        if (existingGrad) throw new CustomError("Email already exists", 409);

        return await this.graduateRepository.createGrad(graduateData);
    }

    async updateGrad(id, graduateData) {
        const branches = (await this.branchRepository.getAllBranches())?.map(
            (branch) => branch.name
        );
        try {
            await updateGraduateValidationSchema(branches).validate(
                graduateData,
                {
                    abortEarly: false,
                    stripUnknown: false,
                }
            );
        } catch (err) {
            const errorMessages = err.errors;
            throw new CustomError(
                errorMessages.join(", ").replace(/"/g, ""),
                422
            );
        }
        const existingGraduate = await this.graduateRepository.getGradById(id);
        if (!existingGraduate) throw new CustomError("Graduate not found", 404);
        return await this.graduateRepository.updateGrad(id, graduateData);
    }

    async deleteGrad(id) {
        const deletedGraduate = await this.graduateRepository.deleteGrad(id);
        if (!deletedGraduate) throw new CustomError("Graduate not found", 404);
        return deletedGraduate;
    }
}

module.exports = graduateController;
