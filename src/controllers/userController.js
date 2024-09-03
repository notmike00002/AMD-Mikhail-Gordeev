const User = require("../models/User");
const jwt = require("jsonwebtoken");
const scoringService = require("../services/scoringService");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    logger.info(`User registered: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`User registration failed: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for user: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      logger.warn(`Profile not found for user ID: ${req.userId}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`Profile retrieved for user ID: ${req.userId}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error retrieving profile: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.updateScore = async (req, res) => {
  try {
    const { challengeId, itemsSorted } = req.body;
    const newScore = await scoringService.calculateScore(
      req.userId,
      challengeId,
      itemsSorted
    );
    logger.info(
      `Score updated for user ID: ${req.userId}, New score: ${newScore}`
    );
    res.json({ newScore });
  } catch (error) {
    logger.error(`Error updating score: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
