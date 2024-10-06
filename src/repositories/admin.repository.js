const Admin = require("../models/admin.model");

class AdminRepository {
    async getAllAdmins() {
        return await Admin.find({ role: "admin" });
    }

    async getAdminById(id) {
        return await Admin.findById(id);
    }

    async getAdminByEmail(email) {
        return await Admin.findOne({ email });
    }

    async createAdmin(adminData) {
        const newAdmin = new Admin({ ...adminData });
        return await newAdmin.save();
    }

    async updateAdmin(adminId, newAdminData) {
        const adminToUpdate = await Admin.findById(adminId);
        adminToUpdate?.set(newAdminData);
        await adminToUpdate?.save();
        return adminToUpdate;
    }

    async deleteAdmin(adminId) {
        return await Admin.findByIdAndDelete(adminId);
    }
}

module.exports = AdminRepository;
