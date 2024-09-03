const mongoose = require("mongoose");
const WasteItem = require("../../src/models/WasteItem");
const WasteCategory = require("../../src/models/WasteCategory");

describe("WasteItem Model Test", () => {
  let category;

  beforeAll(async () => {
    category = new WasteCategory({
      name: "Test Category",
      description: "Test Description",
      disposalGuidelines: "Test Guidelines",
    });
    await category.save();
  });

  it("create & save waste item successfully", async () => {
    const validWasteItem = new WasteItem({
      name: "Test Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    const savedWasteItem = await validWasteItem.save();

    expect(savedWasteItem._id).toBeDefined();
    expect(savedWasteItem.name).toBe(validWasteItem.name);
    expect(savedWasteItem.category.toString()).toBe(category._id.toString());
    expect(savedWasteItem.sortingInstructions).toBe(
      validWasteItem.sortingInstructions
    );
  });

  it("create waste item without required field should fail", async () => {
    const wasteItemWithoutRequiredField = new WasteItem({ name: "Test Item" });
    let err;
    try {
      await wasteItemWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.category).toBeDefined();
  });

  it("create waste item with invalid category should fail", async () => {
    const invalidCategoryId = new mongoose.Types.ObjectId();
    const wasteItemWithInvalidCategory = new WasteItem({
      name: "Test Item",
      category: invalidCategoryId,
      sortingInstructions: "Test Instructions",
    });
    let err;
    try {
      await wasteItemWithInvalidCategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.name).toBe("MongoServerError");
  });

  it("should not save waste item with duplicate name", async () => {
    const wasteItem1 = new WasteItem({
      name: "Duplicate Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    await wasteItem1.save();

    const wasteItem2 = new WasteItem({
      name: "Duplicate Item",
      category: category._id,
      sortingInstructions: "Different Instructions",
    });

    let err;
    try {
      await wasteItem2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });
});
