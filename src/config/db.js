const mongoose = require("mongoose");
const Admin = require("../models/admin.model");

const connect = async () => {
    try {
        const {
            connection: { host },
        } = await mongoose.connect(process.env.DB_URI);

        console.log(`Mongo Connected: ${host}`);

        const existingSuperAdmin = await Admin.findOne({ role: "super admin" });
        if (!existingSuperAdmin) {
            await Admin.create({
                fullName: "admin",
                email: "admin@admin.com",
                password: "12345678",
                role: "super admin",
            });
        }
    } catch (error) {
        throw Error(`Error connecting to mongodb: ${error.message}`);
    }
};

module.exports = { connect };
