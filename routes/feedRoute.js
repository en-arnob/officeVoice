const router = require("express").Router();
const { notAuthenticated } = require("../middleware/authMiddleware");
const { feedGetController } = require("../controllers/feedController");

router.get("/", notAuthenticated, feedGetController);

module.exports = router;
