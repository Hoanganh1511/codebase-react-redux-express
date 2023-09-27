const router = require("express").Router();
const useragent = require("express-useragent");
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidator } = require("../middlewares/users/usersValidator");
const { signIn, addUser } = require("../controllers/user.controller");
router.post("/signup", avatarUpload, addUserValidator, addUser);
router.post("/signin", useragent.express(), signIn);

module.exports = router;
