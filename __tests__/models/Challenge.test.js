const mongoose = require("mongoose");
const Challenge = require("../../src/models/Challenge");

describe("Challenge Model Test", () => {
  it("create & save challenge successfully", async () => {
    const validChallenge = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "medium",
      scoringCriteria: "Test Criteria",
    });
    const savedChallenge = await validChallenge.save();

    expect(savedChallenge._id).toBeDefined();
    expect(savedChallenge.description).toBe(validChallenge.description);
    expect(savedChallenge.difficultyLevel).toBe(validChallenge.difficultyLevel);
    expect(savedChallenge.scoringCriteria).toBe(validChallenge.scoringCriteria);
  });

  it("create challenge without required field should fail", async () => {
    const challengeWithoutRequiredField = new Challenge({
      description: "Test Challenge",
    });
    let err;
    try {
      await challengeWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.difficultyLevel).toBeDefined();
  });

  it("create challenge with invalid difficulty level should fail", async () => {
    const challengeWithInvalidDifficulty = new Challenge({
      description: "Test Challenge",
      difficultyLevel: "invalid",
      scoringCriteria: "Test Criteria",
    });
    let err;
    try {
      await challengeWithInvalidDifficulty.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.difficultyLevel).toBeDefined();
  });
});
