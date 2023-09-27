const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const UserPreference = require("../models/preference.model");
const { verifyContextData, types } = require("./auth.controller");
const { saveLogInfo } = require("../middlewares/logger/logInfo");
const LOG_TYPE = {
  SIGN_IN: "sign in",
  LOGOUT: "logout",
};

const LEVEL = {
  INFO: "info",
  ERROR: "error",
  WARN: "warn",
};
const MESSAGE = {
  SIGN_IN_ATTEMPT: "User attempting to sign in",
  SIGN_IN_ERROR: "Error occurred while singing in user",
  INCORRECT_EMAIL: "Incorrect email",
  INCORRECT_PASSWORD: "Incorrect password",
  DEVICE_BLOCKED: "Sign in attempt from blocked device",
  CONTEXT_DATA_VERIFY_ERORR: "Context data verification failed",
  MULTIPLE_ATTEMPT_WITHOUT_VERIFY:
    "Multiple signin attempts detected without verifying identity",
  LOGOUT_SUCCESS: "User has logged out successfully",
};

const signIn = async (req, res, next) => {
  await saveLogInfo(
    req,
    "User attempting to signin ",
    LOG_TYPE.SIGN_IN,
    LEVEL.INFO
  );

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email: { $eq: email },
    });
    if (!existingUser) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_EMAIL,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      await saveLogInfo(
        req,
        MESSAGE.INCORRECT_PASSWORD,
        LOG_TYPE.SIGN_IN,
        LEVEL.ERROR
      );

      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    console.log(1);
    const isContextAuthEnabled = await UserPreference.findOne({
      user: existingUser._id,
      enalbleContextBasedAuth: true,
    });

    if (isContextAuthEnabled) {
      console.log(2);
      const contextDataResult = await verifyContextData(req, existingUser);

      if (contextDataResult === types.BLOCKED) {
        await saveLogInfo(
          req,
          MESSAGE.DEVICE_BLOCKED,
          LOG_TYPE.SIGN_IN,
          LEVEL.WARN
        );

        return res.status(401).json({
          message:
            "You've been blocked due to suspicious login activity. Please contact support for assistance.",
        });
      }

      if (
        contextDataResult === types.NO_CONTEXT_DATA ||
        contextDataResult === types.ERROR
      ) {
        await saveLogInfo(
          req,
          MESSAGE.CONTEXT_DATA_VERIFY_ERROR,
          LOG_TYPE.SIGN_IN,
          LEVEL.ERROR
        );

        return res.status(500).json({
          message: "Error occured while verifying context data",
        });
      }
      console.log(3);
      if (contextDataResult === types.SUSPICIOUS) {
        await saveLogInfo(
          req,
          MESSAGE.MULTIPLE_ATTEMPT_WITHOUT_VERIFY,
          LOG_TYPE.SIGN_IN,
          LEVEL.WARN
        );

        return res.status(401).json({
          message: `
          You've temporarily  been blocked due to suspicious login acitivity. We have already sent a verification email to your registered email address.
          Please follow the intructions in the email to verify  your identity and gain access to your account.

          Please note that repeated attempts to log in without verifying your identity will result in this device being permanently blocked from accessing your account.
          Thank you for your cooperation
          `,
        });
      }

      if (contextDataResult.mismatchedProps) {
        const mismatchedProps = contextDataResult.mismatchedProps;
        const currentContextData = contextDataResult.currentContextData;
        if (
          mismatchedProps.some((prop) =>
            [
              "ip",
              "country",
              "city",
              "device",
              "deviceLOG_TYPE",
              "os",
              "platform",
              "browser",
            ].includes(prop)
          )
        ) {
          req.mismatchedProps = mismatchedProps;
          req.currentContextData = currentContextData;
          req.user = existingUser;
          return next();
        }
      }
    }
    console.log(5);
    const payload = {
      id: existingUser._id,
      email: existingUser.email,
    };
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7h",
    });
    console.log(6);
    const newRefreshToken = new Token({
      user: existingUser._id,
      refreshToken,
      accessToken,
    });
    console.log(7);
    console.log(newRefreshToken);
    await newRefreshToken.save();
    console.log(8);
    res.status(200).json({
      accessToken,
      refreshToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
      },
    });
  } catch (err) {
    await saveLogInfo(
      req,
      MESSAGE.SIGN_IN_ERROR + err.message,
      LOG_TYPE.SIGN_IN,
      LEVEL.ERROR
    );

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const isConsentGiven = JSON.parse(req.body.isConsentGiven);

  const defaultAvatar =
    "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg";
  const fileUrl = req.files?.[0]?.filename
    ? `${req.protocol}://${req.get("host")}/assets/userAvatars/${
        req.files[0].filename
      }`
    : defaultAvatar;

  const emailDomain = req.body.email.split("@")[1];
  const role = emailDomain === "mod.socialecho.com" ? "moderator" : "general";

  newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: role,
    avatar: fileUrl,
  });

  try {
    await newUser.save();
    console.log("newUser =>", newUser);
    console.log("isNew =>", newUser.isNew);
    if (newUser.isNew) {
      throw new Error("Failed to add user");
    }

    if (isConsentGiven === false) {
      res.status(201).json({
        message: "User added successfully",
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(400).json({
      message: "Failed to add user",
    });
  }
};

module.exports = { signIn, addUser };
