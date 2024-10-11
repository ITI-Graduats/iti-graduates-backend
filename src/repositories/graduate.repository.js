const Graduate = require("../models/graduate.model");

class GraduateRepository {
    async getAllGrads() {
        return await Graduate.find({});
    }

    async getGradById(id) {
        return await Graduate.findById(id);
    }

    async createGrad(graduateData) {
        const graduate = new Graduate(graduateData);
        return await graduate.save();
    }

    async updateGrad(id, graduateData) {
        return await Graduate.findByIdAndUpdate(id, graduateData, {
            new: true,
            runValidators: true,
        });
    }

    async deleteGrad(id) {
        return await Graduate.findByIdAndDelete(id);
    }
}

module.exports = GraduateRepository;
