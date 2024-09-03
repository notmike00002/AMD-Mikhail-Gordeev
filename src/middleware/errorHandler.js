const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}\nStack: ${err.stack}`);
  res.status(500).json({ error: "Something went wrong!" });
};
