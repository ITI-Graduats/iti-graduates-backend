const { isValidObjectId } = require("mongoose");
const { redisClient } = require("../config/redis");
const cacheResource = require("../utils/cacheResource");
const CustomError = require("../utils/CustomError");
const {
  trackValidationSchema,
  updateTrackValidationSchema,
} = require("../utils/validation/track.validation");

class TrackController {
  constructor(trackRepository) {
    this.trackRepository = trackRepository;
  }

  async getAllTracks() {
    if (redisClient.isReady) {
      if (await redisClient.exists("tracks")) {
        const cacheTracks = await redisClient.zRange("tracks", 0, -1);
        return cacheTracks.map((track) => JSON.parse(track));
      }

      const tracks = await cacheResource(
        redisClient,
        "tracks",
        await this.trackRepository.getAllTracks,
      );
      return tracks;
    }
    return await this.trackRepository.getAllTracks();
  }

  async addTrack(trackData) {
    try {
      await trackValidationSchema.validate(trackData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }

    const existingTrack = await this.trackRepository.getTrackByName(
      trackData.name,
    );
    if (existingTrack) throw new CustomError("Track already exists", 409);

    const addedTrack = await this.trackRepository.addTrack(trackData);

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "tracks",
        await this.trackRepository.getAllTracks,
      );

    return addedTrack;
  }

  async updateTrack(id, trackData) {
    if (!isValidObjectId(id)) throw new CustomError("Invalid track id", 400);

    try {
      await updateTrackValidationSchema.validate(trackData, {
        abortEarly: false,
        stripUnknown: false,
      });
    } catch (err) {
      const errorMessages = err.errors;
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 422);
    }
    const existingTrack = await this.trackRepository.getTrackById(id);
    if (!existingTrack) throw new CustomError("Track not found", 404);

    const updatedTrack = await this.trackRepository.updateTrack(id, trackData);

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "tracks",
        await this.trackRepository.getAllTracks,
      );

    return updatedTrack;
  }

  async deleteTrack(id) {
    if (!isValidObjectId(id)) throw new CustomError("Invalid track id", 400);

    const deletedTrack = await this.trackRepository.deleteTrack(id);
    if (!deletedTrack) throw new CustomError("Track not found", 404);

    if (redisClient.isReady)
      await cacheResource(
        redisClient,
        "tracks",
        await this.trackRepository.getAllTracks,
      );
    return deletedTrack;
  }
}

module.exports = TrackController;
