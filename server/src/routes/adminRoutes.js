const express = require("express");
const {
  getDashboardStats,
  getUserStats,
  getAllUsers,
  deleteUser,
  getSettings,
  addSettingValue,
  deleteSettingValue,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/stats", protect, admin, getDashboardStats);
router.get("/users/stats", protect, admin, getUserStats);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

router.get("/settings", getSettings);
router.post("/settings", protect, admin, addSettingValue);
router.delete("/settings/:key/:value", protect, admin, deleteSettingValue);

module.exports = router;
