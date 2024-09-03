const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    logger.info(`Authenticated user: ${req.userId}`);
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    res.status(401).json({ error: "Authentication failed" });
  }
};
