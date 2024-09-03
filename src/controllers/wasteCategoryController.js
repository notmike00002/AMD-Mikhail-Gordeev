const WasteCategory = require("../models/WasteCategory");
const {
  getOrSetCache,
  deleteCache,
  deleteCacheByPattern,
} = require("../utils/redisHelpers");
const logger = require("../utils/logger");

const CACHE_PREFIX = "waste_category";

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await getOrSetCache(`${CACHE_PREFIX}:all`, async () => {
      return await WasteCategory.find();
    });
    logger.info("Retrieved all waste categories");
    res.json(categories);
  } catch (error) {
    logger.error(`Error retrieving waste categories: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await getOrSetCache(
      `${CACHE_PREFIX}:${req.params.id}`,
      async () => {
        const category = await WasteCategory.findById(req.params.id);
        if (!category) {
          throw new Error("Category not found");
        }
        return category;
      }
    );
    logger.info(`Retrieved waste category: ${req.params.id}`);
    res.json(category);
  } catch (error) {
    if (error.message === "Category not found") {
      logger.warn(`Waste category not found: ${req.params.id}`);
      res.status(404).json({ error: error.message });
    } else {
      logger.error(`Error retrieving waste category: ${error.message}`);
      res.status(400).json({ error: error.message });
    }
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, disposalGuidelines } = req.body;
    const category = new WasteCategory({
      name,
      description,
      disposalGuidelines,
    });
    await category.save();

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Created new waste category: ${category._id}`);
    res.status(201).json(category);
  } catch (error) {
    logger.error(`Error creating waste category: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, disposalGuidelines } = req.body;
    const category = await WasteCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, disposalGuidelines },
      { new: true }
    );

    if (!category) {
      logger.warn(`Waste category not found for update: ${req.params.id}`);
      return res.status(404).json({ error: "Category not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Updated waste category: ${req.params.id}`);
    res.json(category);
  } catch (error) {
    logger.error(`Error updating waste category: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await WasteCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      logger.warn(`Waste category not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: "Category not found" });
    }

    await deleteCacheByPattern(`${CACHE_PREFIX}:*`);

    logger.info(`Deleted waste category: ${req.params.id}`);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting waste category: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
