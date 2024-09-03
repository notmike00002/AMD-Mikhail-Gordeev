const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const wasteItemController = require("../../src/controllers/wasteItemController");
const WasteItem = require("../../src/models/WasteItem");
const WasteCategory = require("../../src/models/WasteCategory");
const { client } = require("../../src/config/redis");

const app = express();
app.use(express.json());
app.get("/waste-items", wasteItemController.getAllItems);
app.get("/waste-items/:id", wasteItemController.getItemById);
app.post("/waste-items", wasteItemController.createItem);
app.put("/waste-items/:id", wasteItemController.updateItem);
app.delete("/waste-items/:id", wasteItemController.deleteItem);

jest.mock("../../src/utils/redisHelpers", () => ({
  getOrSetCache: jest.fn((key, callback) => callback()),
  deleteCacheByPattern: jest.fn(),
}));

describe("WasteItem Controller Test", () => {
  let category;

  beforeEach(async () => {
    await WasteItem.deleteMany({});
    await WasteCategory.deleteMany({});

    category = new WasteCategory({
      name: "Test Category",
      description: "Test Description",
      disposalGuidelines: "Test Guidelines",
    });
    await category.save();
  });

  it("should get all waste items", async () => {
    const item = new WasteItem({
      name: "Test Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    await item.save();

    const res = await request(app).get("/waste-items");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Test Item");
  });

  it("should get waste item by id", async () => {
    const item = new WasteItem({
      name: "Test Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    await item.save();

    const res = await request(app).get(`/waste-items/${item._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Item");
  });

  it("should create a new waste item", async () => {
    const newItem = {
      name: "New Item",
      category: category._id,
      sortingInstructions: "New Instructions",
    };

    const res = await request(app).post("/waste-items").send(newItem);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("New Item");
  });

  it("should update an existing waste item", async () => {
    const item = new WasteItem({
      name: "Test Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    await item.save();

    const updatedItem = {
      name: "Updated Item",
      category: category._id,
      sortingInstructions: "Updated Instructions",
    };

    const res = await request(app)
      .put(`/waste-items/${item._id}`)
      .send(updatedItem);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Item");
  });

  it("should delete a waste item", async () => {
    const item = new WasteItem({
      name: "Test Item",
      category: category._id,
      sortingInstructions: "Test Instructions",
    });
    await item.save();

    const res = await request(app).delete(`/waste-items/${item._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");

    const deletedItem = await WasteItem.findById(item._id);
    expect(deletedItem).toBeNull();
  });

  it("should return 404 for non-existent waste item", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/waste-items/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });
});
