const express = require("express");
const router = express.Router();

const adminRouter = (adminController) => {
  router.get("/", async (_, res) => {
    const admins = await adminController.getAllAdmins();
    return res.status(200).send({
      success: "All admins fetched successfully",
      admins,
    });
  });

  router.post("/", async (req, res) => {
    const newAdmin = await adminController.createAdmin(req.body);
    res.status(201).send({
      success: "Admin created successfully",
      newAdmin,
    });
  });

  router.patch("/:id", async (req, res) => {
    const { id: adminId } = req.params;
    const updatedAdmin = await adminController.updateAdmin(adminId, req.body);
    res.status(200).send({
      success: "User updated successfully",
      updatedAdmin,
    });
  });

  router.delete("/:id", async (req, res) => {
    const { id: adminId } = req.params;
    const deletedAdmin = await adminController.deleteAdmin(adminId);
    res.status(200).send({
      success: "User deleted successfully",
      deletedAdmin,
    });
  });
  return router;
};

module.exports = adminRouter;
