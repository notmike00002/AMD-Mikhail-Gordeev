const jwt = require("jsonwebtoken");
const auth = require("../../src/middleware/auth");

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should add userId to request if valid token is provided", () => {
    const token = "valid.token.here";
    const decoded = { userId: "123" };
    req.header.mockReturnValue(`Bearer ${token}`);
    jwt.verify.mockReturnValue(decoded);

    auth(req, res, next);

    expect(req.userId).toBe("123");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    req.header.mockReturnValue(undefined);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    const token = "invalid.token.here";
    req.header.mockReturnValue(`Bearer ${token}`);
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed" });
    expect(next).not.toHaveBeenCalled();
  });
});
