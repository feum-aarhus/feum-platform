const mongoose = require("mongoose");

const participantsSchema = new mongoose.Schema(
  {
    //Automated id
    participantId: Number, //Between 1 and 100
    name: String,
    email: String,
    phone: String,
    // payment: Boolean
  },
  { collection: "Participants" }
);

module.exports = {
  Participant: mongoose.model("EventParticipant", participantsSchema),
};
