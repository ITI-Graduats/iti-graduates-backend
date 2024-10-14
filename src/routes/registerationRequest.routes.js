const express = require("express");
const router = express.Router();
const upload = require("../utils/multer.config");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/checkRole");

const registrationRequestRouter = (registrationRequestController) => {
  
  router.get("/all", auth, checkRole(["super admin"]), async (_, res) => {
    const requests = await registrationRequestController.getAllRequests();
    return res.status(200).send({
      success: "All registration requests fetched successfully",
      requests,
    });
  });

  router.get("/", auth, checkRole(["admin"]), async (req, res) => {
    const { branch: branchId } = req.admin;
    const requests = await registrationRequestController.getRequestsByBranch(
      branchId
    );
    res.status(200).send({
      success: "All registration requests fetched successfully",
      requests,
    });
  });

  router.post(
    "/",
    upload.fields([{ name: "personalPhoto", maxCount: 1 }]),
    async (req, res) => {
      const personalPhoto = req.files;
      const requestData = { ...req.body, personalPhoto };
      const newRequest = await registrationRequestController.createRequest(
        requestData
      );
      res.status(201).send({
        success: "Registration request created successfully",
        newRequest,
      });
    }
  );

  router.delete("/:id", auth, async (req, res) => {
    const { id: requestId } = req.params;
    const { action } = req.query;
    const request = await registrationRequestController.acceptOrRejectRequest(
      requestId,
      action
    );
    res.status(200).send({
      success: `Registration request ${action}ed`,
      request,
    });
  });

  return router;
};

module.exports = registrationRequestRouter;
