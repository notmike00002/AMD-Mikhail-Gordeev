const redis = require("redis");
const logger = require("../utils/logger");

const client = redis.createClient({
  url: process.env.REDIS_URI,
});

client.on("error", (err) => logger.error("Redis Client Error", err));
client.on("connect", () => logger.info("Redis Client Connected"));
client.on("ready", () => logger.info("Redis Client Ready"));

const connectRedis = async () => {
  await client.connect();
  logger.info("Redis connected successfully");

  // Test Redis connection
  await client.set("test_key", "Redis is working!");
  const value = await client.get("test_key");
  logger.info("Test Redis Get:", value);
};

module.exports = { client, connectRedis };
