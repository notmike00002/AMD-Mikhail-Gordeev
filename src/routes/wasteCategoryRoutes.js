const express = require("express");
const router = express.Router();
const wasteCategoryController = require("../controllers/wasteCategoryController");
const auth = require("../middleware/auth");

router.get("/", wasteCategoryController.getAllCategories);
router.get("/:id", wasteCategoryController.getCategoryById);
router.post("/", auth, wasteCategoryController.createCategory);
router.put("/:id", auth, wasteCategoryController.updateCategory);
router.delete("/:id", auth, wasteCategoryController.deleteCategory);

module.exports = router;
