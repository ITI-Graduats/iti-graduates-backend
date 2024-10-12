const express = require("express");
const router = express.Router();

const registrationRequestRouter = (registrationRequestController) => {
  router.get("/", async (req, res) => {
    const requests = await registrationRequestController.getAllRequests(req.query);
    if (requests.length)
      return res.status(200).send({
        success: "All registration requests fetched successfully",
        requests,
      });
    res.status(200).send("There are no registration requests");
  });

  router.post("/", async (req, res) => {
    const newRequest = await registrationRequestController.createRequest(req.body);
    res.status(201).send({
      success: "Registration request created successfully",
      newRequest,
    });
  });

  router.patch("/:id/accept", async (req, res) => {
    const { id: requestId } = req.params;
    const graduate = await registrationRequestController.acceptRequest(requestId);
    res.status(200).send({
      success: "Registration request accepted and graduate created",
      graduate,
    });
  });

  router.patch("/:id/decline", async (req, res) => {
    const { id: requestId } = req.params;
    const declinedRequest = await registrationRequestController.declineRequest(requestId);
    res.status(200).send({
      success: "Registration request declined",
      declinedRequest,
    });
  });

  router.delete("/:id", async (req, res) => {
    const { id: requestId } = req.params;
    const deletedRequest = await registrationRequestController.deleteRequest(requestId);
    res.status(200).send({
      success: "Registration request deleted successfully",
      deletedRequest,
    });
  });

  return router;
};

module.exports = registrationRequestRouter;
