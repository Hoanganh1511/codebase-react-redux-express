const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {},
    description: {},
    banner: {},
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    banneedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

communitySchema.index({ name: "text" });
module.exports = mongoose.model("Community", communitySchema);
