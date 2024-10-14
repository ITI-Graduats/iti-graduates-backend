const mongoose = require("mongoose");
const Admin = require("../models/admin.model");
const { connectToRedis } = require("./redis");

const connect = async () => {
  try {
    const {
      connection: { host },
    } = await mongoose.connect(process.env.DB_URI);

    console.log(`Mongo Connected: ${host}`);

    await connectToRedis();

    const existingSuperAdmin = await Admin.findOne({ role: "super admin" });
    if (!existingSuperAdmin) {
      await Admin.create({
        fullName: "admin",
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: "super admin",
      });
    }
  } catch (error) {
    throw Error(`Error connecting to mongodb: ${error.message}`);
  }
};

module.exports = { connect };
