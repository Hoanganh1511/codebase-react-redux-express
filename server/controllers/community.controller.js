const Community = require("../models/community.model");
const joinCommunity = async (req, res) => {
  try {
    const { name } = req.params;
    const community = await Community.findOneAnUpdate(
      {
        name,
      },
      {
        $push: {
          members: req.userId,
        },
      },
      { new: true }
    );

    res.status(200).json(community);
  } catch (err) {
    res.status(500).json({
      message: "Error joining community",
    });
  }
};
const getMemberCommunities = async (req, res) => {
  try {
    const communities = await Community.find({
      members: {
        $in: [req.userId],
      },
    });
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({
      message: "Error getting communities",
    });
  }
};
module.exports = {
  joinCommunity,
  getMemberCommunities,
};
