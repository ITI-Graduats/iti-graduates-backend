const Graduate = require("../models/graduate.model");

class GraduateRepository {
  async getFilteredGrads(limit, skip, query) {
    console.log(query);
    const totalGraduatesCount = await Graduate.countDocuments(query);
    const graduates = await Graduate.find(query).skip(skip).limit(limit);
    const currentPage = Math.floor(skip / limit) + 1;
    const pagesCount = Math.ceil(totalGraduatesCount / limit);
    return { graduates, totalGraduatesCount, currentPage, pagesCount };
  }

  async getGradById(id) {
    return await Graduate.findById(id);
  }
  async getGradByEmail(email) {
    return await Graduate.findOne({ email });
  }
  async getGradsByBranch(branchName) {
    return await Graduate.find({
      preferredTeachingBranches: { $in: [branchName] },
    });
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
