const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const authRouter = (authController) => {
  router.post("/login", async (req, res) => {
    const { accessToken, refreshToken, admin } = await authController.login(
      req.body,
    );
    const options = {
      httpOnly: true,
    };
    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "Admin logged in successfully",
      accessToken,
      admin,
    });
  });

  router.post("/logout", auth, async (req, res) => {
    const { _id: adminId } = req.admin;
    const admin = await authController.logout(adminId);
    const options = {
      httpOnly: true,
    };
    res
      .status(200)
      .clearCookie("refreshToken", options)
      .send({ success: "Admin logged out successfully", admin });
  });

  router.post("/refreshAccessToken", async (req, res) => {
    const { refreshToken: incomingRefreshToken } = req.cookies;
    const { accessToken, refreshToken, admin } =
      await authController.refreshAccessToken(incomingRefreshToken);
    const options = {
      httpOnly: true,
    };
    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "Access token refreshed successfully",
      accessToken,
      admin,
    });
  });

  return router;
};

module.exports = authRouter;
