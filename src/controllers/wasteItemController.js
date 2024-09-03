const WasteItem = require("../models/WasteItem");
const {
  getOrSetCache,
  deleteCache,
  deleteCacheByPattern,
} = require("../utils/redisHelpers");
const logger = require("../utils/logger");

const CACHE_PREFIX = "waste_item";

exports.getAllItems = async (req, res) => {
  try {
    const items = await getOrSetCache(`${CACHE_PREFIX}:all`, async () => {
      return await WasteItem.find().populate("category");
    });
    logger.info("Retrieved all waste items");
    res.json(items);
  } catch (error) {
    logger.error(`Error retrieving waste items: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await getOrSetCache(
      `${CACHE_PREFIX}:${req.params.id}`,
      async () => {
        const item = await WasteItem.findById(req.params.id).populate(
          "category"
        );
        if (!item) {
          throw new Error("Item not found");
        }
        return item;
      }
    );
    logger.info(`Retrieved waste item: ${req.params.id}`);
    res.json(item);
  } catch (error) {
    if (error.message === "Item not found") {
      logger.warn(`Waste item not found: ${req.params.id}`);
      res.status(404).json({ error: error.message });
    } else {
      logger.error(`Error retrieving waste item: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, category, sortingInstructions } = req.body;
    const item = new WasteItem({ name, category, sortingInstructions });
    await item.save();

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Created new waste item: ${item._id}`);
    res.status(201).json(item);
  } catch (error) {
    logger.error(`Error creating waste item: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, category, sortingInstructions } = req.body;
    const item = await WasteItem.findByIdAndUpdate(
      req.params.id,
      { name, category, sortingInstructions },
      { new: true }
    ).populate("category");

    if (!item) {
      logger.warn(`Waste item not found for update: ${req.params.id}`);
      return res.status(404).json({ error: "Item not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Updated waste item: ${req.params.id}`);
    res.json(item);
  } catch (error) {
    logger.error(`Error updating waste item: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await WasteItem.findByIdAndDelete(req.params.id);
    if (!item) {
      logger.warn(`Waste item not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: "Item not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Deleted waste item: ${req.params.id}`);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting waste item: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
