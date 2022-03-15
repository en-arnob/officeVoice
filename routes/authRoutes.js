const router = require("express").Router();
const signupValidator = require("../utils/signupValidator");
const { isAuthenticated } = require("../middleware/authMiddleware");

const {
  loginGetController,
  loginPostController,
  signupGetController,
  signupPostController,
  logoutController,
} = require("../controllers/authController");

router.get("/signup", isAuthenticated, signupGetController);
router.post("/signup", signupValidator, signupPostController);

router.get("/login", isAuthenticated, loginGetController);
router.post("/login", loginPostController);

router.get("/logout", logoutController);

module.exports = router;
