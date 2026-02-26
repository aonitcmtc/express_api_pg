const router = require("express").Router();
const logadmin = require("../controllers/logadmin.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/countall", authMiddleware, logadmin.countAll);

module.exports = router;