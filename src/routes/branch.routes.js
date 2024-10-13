const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const branchRouter = (branchController) => {
  router.get("/", async (_, res) => {
    const branches = await branchController.getAllBranches();
    res
      .status(200)
      .send({ success: "All branches fetched successfully", branches });
  });

  router.post("/", auth, async (req, res) => {
    const branch = await branchController.addBranch(req.body);
    res.status(201).send({ success: "Branch added successfully", branch });
  });

  router.patch("/:id", auth, async (req, res) => {
    const branch = await branchController.updateBranch(req.params.id, req.body);
    res.status(200).send({ success: "Branch updated successfully", branch });
  });

  router.delete("/:id", auth, async (req, res) => {
    const branch = await branchController.deleteBranch(req.params.id);
    res.status(200).send({ success: "Branch deleted successfully", branch });
  });

  return router;
};

module.exports = branchRouter;
