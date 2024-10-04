const express = require("express");
const router = express.Router();

const userRouter = (userController) => {
  router.get("/", async (req, res) => {
    res.status(200).send({ success: "All users fetched successfully" });
  });

  return router;
};

module.exports = userRouter;
