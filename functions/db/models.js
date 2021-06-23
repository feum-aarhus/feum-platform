const mongoose = require("mongoose");

const participantsSchema = new mongoose.Schema(
  {
    participantId: Number,
    name: String,
    email: String,
    phone: String,
    ticketDownloadedTimes: Number,
    ticketScanned: Boolean,
  },
  { collection: "Participants" }
);

module.exports = {
  Participant: mongoose.model("EventParticipant", participantsSchema),
};
