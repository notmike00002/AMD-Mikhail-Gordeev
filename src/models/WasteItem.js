const mongoose = require("mongoose");

const wasteItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WasteCategory",
    required: true,
  },
  sortingInstructions: { type: String, required: true },
});

module.exports = mongoose.model("WasteItem", wasteItemSchema, "waste_items");
