const User = require("../models/User");
const Challenge = require("../models/Challenge");
const WasteItem = require("../models/WasteItem");
const logger = require("../utils/logger");

exports.calculateScore = async (userId, challengeId, itemsSorted) => {
  const user = await User.findById(userId);
  const challenge = await Challenge.findById(challengeId);

  if (!user || !challenge) {
    logger.error(
      `User or Challenge not found. User: ${userId}, Challenge: ${challengeId}`
    );
    throw new Error("User or Challenge not found");
  }

  let score = 0;
  for (const item of itemsSorted) {
    const wasteItem = await WasteItem.findById(item.itemId).populate(
      "category"
    );
    if (wasteItem && wasteItem.category._id.toString() === item.categoryId) {
      score += 1;
    }
  }

  // Apply difficulty multiplier
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };
  score *= difficultyMultiplier[challenge.difficultyLevel];

  // Update user's score
  user.score += score;
  await user.save();

  logger.info(`Score calculated for user ${userId}: ${score} points`);
  return user.score;
};
