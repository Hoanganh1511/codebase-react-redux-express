const mongoose = require("mongoose");
const {
  encryptField,
  decryptField,
  decryptData,
} = require("../utils/encryption");
const LogSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  context: {
    type: String,
    set: encryptField,
    get: decryptField,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    requried: true,
  },
  level: {
    type: String,
    required: true,
  },
  timestampt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 604800,
  },
});
LogSchema.methods.decryptContext = function () {
  return decryptData(this.context);
};

module.exports = mongoose.model("Log", LogSchema);
