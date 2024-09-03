const express = require("express");
const router = express.Router();
const wasteItemController = require("../controllers/wasteItemController");
const auth = require("../middleware/auth");

router.get("/", wasteItemController.getAllItems);
router.get("/:id", wasteItemController.getItemById);
router.post("/", auth, wasteItemController.createItem);
router.put("/:id", auth, wasteItemController.updateItem);
router.delete("/:id", auth, wasteItemController.deleteItem);

module.exports = router;
