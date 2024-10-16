const CustomError = require("../utils/CustomError");
const {
  trackValidationSchema,
  updateTrackValidationSchema,
} = require("../utils/validation/track.validation");

class TrackController {
  trackRepository;

  constructor(trackRepository) {
    this.trackRepository = trackRepository;
  }

  async getAllTracks() {
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
      trackData.name
    );
    if (existingTrack) throw new CustomError("Track already exists", 409);

    return await this.trackRepository.addTrack(trackData);
  }

  async updateTrack(id, trackData) {
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
    return await this.trackRepository.updateTrack(id, trackData);
  }

  async deleteTrack(id) {
    const deletedTrack = await this.trackRepository.deleteTrack(id);
    if (!deletedTrack) throw new CustomError("Track not found", 404);
    return deletedTrack;
  }
}

module.exports = TrackController;
