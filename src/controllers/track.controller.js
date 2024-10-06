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
    const isValid = await trackValidationSchema.isValid(trackData, {
      abortEarly: false,
    });
    if (!isValid) throw new CustomError("Track data validation failed", 400);
    return await this.trackRepository.addTrack(trackData);
  }

  async updateTrack(id, trackData) {
    const isValid = await updateTrackValidationSchema.isValid(trackData, {
      abortEarly: false,
    });
    if (!isValid) throw new CustomError("Track data validation failed", 400);
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
