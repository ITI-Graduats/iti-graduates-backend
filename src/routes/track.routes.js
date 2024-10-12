const express = require("express");
const router = express.Router();

const trackRouter = (trackController) => {
  router.get("/", async (req, res) => {
    const tracks = await trackController.getAllTracks();
    res
      .status(200)
      .send({ success: "All tracks fetched successfully", tracks });
  });

  router.post("/", async (req, res) => {
    const track = await trackController.addTrack(req.body);
    res.status(200).send({ success: "Track added successfully", track });
  });

  router.patch("/:id", async (req, res) => {
    const track = await trackController.updateTrack(req.params.id, req.body);
    res.status(200).send({ success: "Track updated successfully", track });
  });

  router.delete("/:id", async (req, res) => {
    const track = await trackController.deleteTrack(req.params.id);
    res.status(200).send({ success: "Track deleted successfully", track });
  });

  return router;
};

module.exports = trackRouter;
