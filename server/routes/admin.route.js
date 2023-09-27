const router = require("express").Router();
const { signIn } = require("../controllers/admin.controller");
router.post("/signin", signIn);

module.exports = router;
