const Admin = require("../models/admin.model");

class AdminRepository {
  async getAllAdmins() {
    return await Admin.find({ role: "admin" }).populate({
      path: "branch",
      select: "-_id -isActive",
    });
  }

  async getAdminById(id) {
    return await Admin.findById(id).populate({
      path: "branch",
      select: "-_id -isActive",
    });
  }

  async getAdminByEmail(email) {
    return await Admin.findOne({ email });
  }

  async createAdmin(adminData) {
    const newAdmin = new Admin({ ...adminData });
    await newAdmin.save();
    return await newAdmin.populate({
      path: "branch",
      select: "-_id -isActive",
    });
  }

  async updateAdmin(adminId, newAdminData) {
    const adminToUpdate = await Admin.findById(adminId);
    adminToUpdate?.set(newAdminData);
    await adminToUpdate?.save();
    return adminToUpdate.populate({
      path: "branch",
      select: "-_id -isActive",
    });
  }

  async deleteAdmin(adminId) {
    return await Admin.findByIdAndDelete(adminId);
  }
}

module.exports = AdminRepository;
