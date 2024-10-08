const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");
const Admin = require("../models/admin.model");

const graduateRouter = (graduateController) => {
  router.get("/grads", auth, checkRole(Admin), async (req, res) => {
    const graduates = await graduateController.getAllGrads();
    res
      .status(200)
      .send({ success: "All graduates fetched successfully", graduates });
  });

  router.get("/grads/:id", auth, checkRole(Admin), async (req, res) => {
    const { id } = req.params;
    const graduate = await graduateController.getGradById(id);
    res
      .status(200)
      .send({ success: "Graduate fetched successfully", graduate });
  });

  router.patch("/grads/:id", auth, checkRole(Admin), async (req, res) => {
    const graduate = await graduateController.updateGrad(
      req.params.id,
      req.body
    );
    res
      .status(200)
      .send({ success: "Graduate updated successfully", graduate });
  });

  router.post("/grads", async (req, res) => {
    const graduate = await graduateController.createGrad(req.body);
    res
      .status(200)
      .send({ success: "Graduate created successfully", Graduate });
  });

  router.delete("/grads/:id", auth, checkRole(Admin), async (req, res) => {
    const graduate = await graduateController.deleteGrad(req.params.id);
    res
      .status(200)
      .send({ success: "Graduate deleted successfully", graduate });
  });

  return router;
};

module.exports = graduateRouter;
