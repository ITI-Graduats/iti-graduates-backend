const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const trackRouter = (trackController) => {
  router.get("/", async (_, res) => {
    const tracks = await trackController.getAllTracks();
    res
      .status(200)
      .send({ success: "All tracks fetched successfully", tracks });
  });

  router.post("/", auth, async (req, res) => {
    const track = await trackController.addTrack(req.body);
    res.status(200).send({ success: "Track added successfully", track });
  });

  router.patch("/:id", auth, async (req, res) => {
    const track = await trackController.updateTrack(req.params.id, req.body);
    res.status(200).send({ success: "Track updated successfully", track });
  });

  router.delete("/:id", auth, async (req, res) => {
    const track = await trackController.deleteTrack(req.params.id);
    res.status(200).send({ success: "Track deleted successfully", track });
  });

  return router;
};

module.exports = trackRouter;
