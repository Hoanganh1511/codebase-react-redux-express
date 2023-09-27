const router = require("express").Router();

const {
  joinCommunity,
  getMemberCommunities,
} = require("../controllers/community.controller");

router.post("/:name/join", joinCommunity);
router.get("/member", getMemberCommunities);

module.exports = router;
