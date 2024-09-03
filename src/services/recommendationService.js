const WasteItem = require("../models/WasteItem");
const WasteCategory = require("../models/WasteCategory");

exports.getRecommendations = async (userId) => {
  //For this example, we'll just
  // return a mix of random waste items and categories.

  const items = await WasteItem.aggregate([{ $sample: { size: 3 } }]);
  const categories = await WasteCategory.aggregate([{ $sample: { size: 2 } }]);

  return {
    recommendedItems: items,
    recommendedCategories: categories,
    tips: [
      "Remember to rinse containers before recycling",
      "Compost your food scraps to reduce landfill waste",
      "Use reusable bags when shopping to minimize plastic waste",
    ],
  };
};
