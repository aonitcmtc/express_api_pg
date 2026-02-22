const router = require("express").Router();
const logmysite = require("../controllers/logmysite.controller");
const authMiddleware = require("../middleware/auth.middleware");

// router.get("/", authMiddleware, logmysite.function);
router.post("/add", authMiddleware, logmysite.addLog);
router.get("/getall", authMiddleware, logmysite.getAll);
router.get("/getbyip", authMiddleware, logmysite.getbyIP);
router.get("/getbyagent", authMiddleware, logmysite.getbyAgent);
router.get("/getbyurl", authMiddleware, logmysite.getbyUrl);
router.get("/countlanding", authMiddleware, logmysite.countLanding);
router.get("/countmysite", authMiddleware, logmysite.countMysite);


module.exports = router;

