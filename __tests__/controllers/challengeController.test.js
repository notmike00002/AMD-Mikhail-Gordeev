const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const challengeController = require("../../src/controllers/challengeController");
const Challenge = require("../../src/models/Challenge");
const { client } = require("../../src/config/redis");

const app = express();
app.use(express.json());
app.get("/challenges", challengeController.getAllChallenges);
app.get("/challenges/:id", challengeController.getChallengeById);
app.post("/challenges", challengeController.createChallenge);
app.put("/challenges/:id", challengeController.updateChallenge);
app.delete("/challenges/:id", challengeController.deleteChallenge);

jest.mock("../../src/utils/redisHelpers", () => ({
  getOrSetCache: jest.fn((key, callback) => callback()),
  deleteCacheByPattern: jest.fn(),
}));

describe("Challenge Controller Test", () => {
  beforeEach(async () => {
    await Challenge.deleteMany({});
  });

  it("should get all challenges", async () => {
    const challenge = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "medium",
      scoringCriteria: "Test Criteria",
    });
    await challenge.save();

    const res = await request(app).get("/challenges");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].description).toBe("Test Challenge");
  });

  it("should get challenge by id", async () => {
    const challenge = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "medium",
      scoringCriteria: "Test Criteria",
    });
    await challenge.save();

    const res = await request(app).get(`/challenges/${challenge._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Test Challenge");
  });

  it("should create a new challenge", async () => {
    const newChallenge = {
      description: "New Challenge",
      difficultyLevel: "hard",
      scoringCriteria: "New Criteria",
    };

    const res = await request(app).post("/challenges").send(newChallenge);
    expect(res.statusCode).toBe(201);
    expect(res.body.description).toBe("New Challenge");
  });

  it("should update an existing challenge", async () => {
    const challenge = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "medium",
      scoringCriteria: "Test Criteria",
    });
    await challenge.save();

    const updatedChallenge = {
      description: "Updated Challenge",
      difficultyLevel: "easy",
      scoringCriteria: "Updated Criteria",
    };

    const res = await request(app)
      .put(`/challenges/${challenge._id}`)
      .send(updatedChallenge);
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe("Updated Challenge");
  });

  it("should delete a challenge", async () => {
    const challenge = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "medium",
      scoringCriteria: "Test Criteria",
    });
    await challenge.save();

    const res = await request(app).delete(`/challenges/${challenge._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Challenge deleted successfully");

    const deletedChallenge = await Challenge.findById(challenge._id);
    expect(deletedChallenge).toBeNull();
  });

  it("should return 404 for non-existent challenge", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/challenges/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });
});
