const mongoose = require("mongoose");
const User = require("../../src/models/User");

describe("User Model Test", () => {
  it("create & save user successfully", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).not.toBe(userData.password); // Password should be hashed
  });

  it("create user without required field should fail", async () => {
    const userWithoutRequiredField = new User({ name: "Test User" });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it("should not save user with duplicate email", async () => {
    const userData = {
      name: "Test User 1",
      email: "duplicate@example.com",
      password: "password123",
    };
    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });

  // Add a test for password hashing
  it("should hash the password before saving", async () => {
    const userData = {
      name: "Password Test User",
      email: "passwordtest@example.com",
      password: "testpassword",
    };
    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(userData.password.length);
  });

  // Add a test for the comparePassword method
  it("should correctly compare passwords", async () => {
    const userData = {
      name: "Compare Password User",
      email: "comparepassword@example.com",
      password: "testpassword",
    };
    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword("testpassword");
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword("wrongpassword");
    expect(isNotMatch).toBe(false);
  });
});
