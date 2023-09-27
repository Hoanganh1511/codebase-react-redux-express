const Admin = require("../models/admin.model");
const AdminToken = require("../models/token.admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await Admin.findOne({
      username,
    });
    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });
    const newAdminToken = new AdminToken({
      user: existingUser._id,
      accessToken,
    });
    await newAdminToken.save();

    res.status(200).json({
      accessToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = {
  signIn,
};
