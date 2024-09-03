const Challenge = require("../models/Challenge");
const {
  getOrSetCache,
  deleteCache,
  deleteCacheByPattern,
} = require("../utils/redisHelpers");
const logger = require("../utils/logger");

const CACHE_PREFIX = "challenge";

exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await getOrSetCache(`${CACHE_PREFIX}:all`, async () => {
      return await Challenge.find();
    });
    logger.info("Retrieved all challenges");
    res.json(challenges);
  } catch (error) {
    logger.error(`Error retrieving challenges: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await getOrSetCache(
      `${CACHE_PREFIX}:${req.params.id}`,
      async () => {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) {
          throw new Error("Challenge not found");
        }
        return challenge;
      }
    );
    logger.info(`Retrieved challenge: ${req.params.id}`);
    res.json(challenge);
  } catch (error) {
    if (error.message === "Challenge not found") {
      logger.warn(`Challenge not found: ${req.params.id}`);
      res.status(404).json({ error: error.message });
    } else {
      logger.error(`Error retrieving challenge: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
};

exports.createChallenge = async (req, res) => {
  try {
    const { description, difficultyLevel, scoringCriteria } = req.body;
    const challenge = new Challenge({
      description,
      difficultyLevel,
      scoringCriteria,
    });
    await challenge.save();

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Created new challenge: ${challenge._id}`);
    res.status(201).json(challenge);
  } catch (error) {
    logger.error(`Error creating challenge: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    const { description, difficultyLevel, scoringCriteria } = req.body;
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { description, difficultyLevel, scoringCriteria },
      { new: true }
    );

    if (!challenge) {
      logger.warn(`Challenge not found for update: ${req.params.id}`);
      return res.status(404).json({ error: "Challenge not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Updated challenge: ${req.params.id}`);
    res.json(challenge);
  } catch (error) {
    logger.error(`Error updating challenge: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      logger.warn(`Challenge not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: "Challenge not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Deleted challenge: ${req.params.id}`);
    res.json({ message: "Challenge deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting challenge: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
