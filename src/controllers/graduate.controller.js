const CustomError = require("../utils/CustomError");
const {
  graduateValidationSchema,
  updateGraduateValidationSchema,
} = require("../utils/validation/graduate.validation");

class graduateController {
  graduateRepository;

  constructor(graduateRepository) {
    this.graduateRepository = graduateRepository;
  }

  async getAllGrads() {
    return await this.graduateRepository.getAllGrads();
  }

  async createGrad(graduateData) {
    const isValid = await graduateValidationSchema.isValid(graduateData, {
      abortEarly: false,
    });
    if (!isValid) throw new CustomError("Graduate data validation failed", 400);
    return await this.graduateRepository.createGrad(graduateData);
  }

  async updateGrad(id, graduateData) {
    const isValid = await updateGraduateValidationSchema.isValid(graduateData, {
      abortEarly: false,
    });
    if (!isValid) throw new CustomError("Graduate data validation failed", 400);
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
