const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const wasteCategoryRoutes = require("./routes/wasteCategoryRoutes");
const wasteItemRoutes = require("./routes/wasteItemRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const logger = require("./utils/logger");

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

dotenv.config();
const app = express();

// Redis client setup
let redisClient = createClient({ url: process.env.REDIS_URI });
redisClient.connect().catch(console.error);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.use(express.json());

    // Session middleware setup
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );

    app.use("/api/users", userRoutes);
    app.use("/api/waste-categories", wasteCategoryRoutes);
    app.use("/api/waste-items", wasteItemRoutes);
    app.use("/api/challenges", challengeRoutes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    logger.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
