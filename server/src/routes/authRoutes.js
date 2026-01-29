const express = require("express");
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout,
  getUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);
router.get("/me", protect, getUserProfile);

module.exports = router;
