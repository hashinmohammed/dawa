const express = require("express");
const {
  getDashboardStats,
  getUserStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", protect, admin, getDashboardStats);
router.get("/users/stats", protect, admin, getUserStats);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
