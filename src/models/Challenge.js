const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  difficultyLevel: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  scoringCriteria: { type: String, required: true },
});

module.exports = mongoose.model("Challenge", challengeSchema);
