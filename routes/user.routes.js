const router = require("express").Router();
const user = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, user.getUsers);

module.exports = router;