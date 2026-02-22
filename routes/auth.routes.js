const router = require("express").Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh", auth.refreshToken);
router.post("/logout", auth.logout);
router.post("/gettoken", auth.getToken);


module.exports = router;