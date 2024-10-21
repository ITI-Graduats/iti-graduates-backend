const express = require("express");
const router = express.Router();

const authRouter = (authController) => {
  const options = {
    httpOnly: true,
  };

  router.post("/login", async (req, res) => {
    const { accessToken, refreshToken, admin } = await authController.login(
      req.body
    );

    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "Admin logged in successfully",
      accessToken,
      admin,
    });
  });

  router.post("/logout", async (req, res) => {
    const { refreshToken: incomingRefreshToken } = req.cookies;
    const admin = await authController.logout(incomingRefreshToken);
    res
      .status(200)
      .clearCookie("refreshToken")
      .send({ success: "Admin logged out successfully", admin });
  });

  router.post("/refreshAccessToken", async (req, res) => {
    const { refreshToken: incomingRefreshToken } = req.cookies;
    const { accessToken, refreshToken, admin } =
      await authController.refreshAccessToken(incomingRefreshToken);

    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "Access token refreshed successfully",
      accessToken,
      admin,
    });
  });

  return router;
};

module.exports = authRouter;
