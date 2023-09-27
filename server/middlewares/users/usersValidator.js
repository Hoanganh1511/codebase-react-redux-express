const { check, validationResult } = require("express-validator");
const User = require("../../models/user.model");
const path = require("path");
const fs = require("fs");

const addUserValidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required !")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .custom((value, { req }) => {
      switch (true) {
        case value.length === 1:
          throw new Error("Name must be at least 2 characters long");
        case value.length > 20:
          throw new Error("Name cannot be more than 20 characters long");
        default:
          return true;
      }
    })
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(
            "There is already an account associated with this email address"
          );
        }
      } catch (err) {
        throw err;
      }
    }),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  check("role").default("general"),
];

module.exports = {
  addUserValidator,
};
