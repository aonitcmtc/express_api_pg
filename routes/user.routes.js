const router = require("express").Router();
const user = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, user.getUsers);
router.get("/getusers", authMiddleware, user.getUserAllActive);
router.get("/getuserimg", authMiddleware, user.getUrlImageS3);
router.get("/countuseractive",authMiddleware , user.getUserActive);

module.exports = router;