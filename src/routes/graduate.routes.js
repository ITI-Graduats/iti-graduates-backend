const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

const graduateRouter = (graduateController) => {
  router.get("/all", auth, checkRole(["super admin"]), async (req, res) => {
    const {
      page = 1,
      limit = 8,
      fullName,
      cityOfBirth,
      branch,
      itiGraduationYear,
      preferredTeachingBranches,
      interestedInTeaching,
    } = req.query;

    const result = await graduateController.getFilteredGrads(
      page,
      limit,
      fullName,
      cityOfBirth,
      branch,
      itiGraduationYear,
      preferredTeachingBranches,
      interestedInTeaching
    );
    res.status(200).send({
      success: "All graduates fetched successfully",
      paginationMetaData: {
        totalGraduatesCount: result.totalGraduatesCount,
        currentPage: result.currentPage,
        pagesCount: result.pagesCount,
      },
      graduates: result.graduates,
    });
  });

  router.get("/", auth, checkRole(["admin"]), async (req, res) => {
    const { branch: adminBranch } = req.admin;
    const {
      page = 1,
      limit = 8,
      fullName,
      cityOfBirth,
      branch,
      itiGraduationYear,
      interestedInTeaching,
    } = req.query;
    const result = await graduateController.getFilteredGrads(
      page,
      limit,
      fullName,
      cityOfBirth,
      branch,
      itiGraduationYear,
      adminBranch,
      interestedInTeaching
    );
    res.status(200).send({
      success: "All graduates fetched successfully",
      paginationMetaData: {
        totalGraduatesCount: result.totalGraduatesCount,
        currentPage: result.currentPage,
        pagesCount: result.pagesCount,
      },
      graduates: result.graduates,
    });
  });

  router.get("/dashboard-data", auth, async (req, res) => {
    const { role, branch: branchId } = req.admin;
    const dashboardData = await graduateController.getDashboardData(
      role,
      branchId
    );
    res.status(200).send({
      success: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  });

  router.get("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const graduate = await graduateController.getGradById(id);
    res.status(200).send({
      success: "Graduate fetched successfully",
      graduate,
    });
  });

  router.patch("/:id", auth, async (req, res) => {
    const graduate = await graduateController.updateGrad(
      req.params.id,
      req.body
    );
    res.status(200).send({
      success: "Graduate updated successfully",
      graduate,
    });
  });

  router.post("/", async (req, res) => {
    const graduate = await graduateController.createGrad(req.body);
    res.status(200).send({
      success: "Graduate created successfully",
      graduate,
    });
  });

  router.delete("/:id", auth, async (req, res) => {
    const graduate = await graduateController.deleteGrad(req.params.id);
    res.status(200).send({
      success: "Graduate deleted successfully",
      graduate,
    });
  });

  return router;
};

module.exports = graduateRouter;
