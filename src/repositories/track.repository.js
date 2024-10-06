const Track = require("../models/track.model");

class TrackRepository {
  async getAllTracks() {
    return await Track.find({});
  }

  async getTrackById(id) {
    return await Track.findById(id);
  }

  async addTrack(trackData) {
    const track = new Track(trackData);
    return await track.save();
  }

  async updateTrack(id, trackData) {
    return await Track.findByIdAndUpdate(id, trackData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTrack(id) {
    return await Track.findByIdAndDelete(id);
  }
}

module.exports = TrackRepository;
