const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const wasteCategoryController = require("../../src/controllers/wasteCategoryController");
const WasteCategory = require("../../src/models/WasteCategory");
const { client } = require("../../src/config/redis");

const app = express();
app.use(express.json());
app.get("/waste-categories", wasteCategoryController.getAllCategories);
app.get("/waste-categories/:id", wasteCategoryController.getCategoryById);

jest.mock("../../src/utils/redisHelpers", () => ({
  getOrSetCache: jest.fn((key, callback) => callback()),
}));

describe("WasteCategory Controller Test", () => {
  beforeEach(async () => {
    await WasteCategory.deleteMany({});
  });

  it("should get all categories", async () => {
    const category = new WasteCategory({
      name: "Plastic",
      description: "Plastic waste",
      disposalGuidelines: "Recycle in blue bin",
    });
    await category.save();

    const res = await request(app).get("/waste-categories");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Plastic");
  });

  it("should get category by id", async () => {
    const category = new WasteCategory({
      name: "Paper",
      description: "Paper waste",
      disposalGuidelines: "Recycle in green bin",
    });
    await category.save();

    const res = await request(app).get(`/waste-categories/${category._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Paper");
  });

  it("should return 404 for non-existent category", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/waste-categories/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });
});
