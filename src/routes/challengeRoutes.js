const express = require("express");
const router = express.Router();
const challengeController = require("../controllers/challengeController");
const auth = require("../middleware/auth");

router.get("/", challengeController.getAllChallenges);
router.get("/:id", challengeController.getChallengeById);
router.post("/", auth, challengeController.createChallenge);
router.put("/:id", auth, challengeController.updateChallenge);
router.delete("/:id", auth, challengeController.deleteChallenge);

module.exports = router;
