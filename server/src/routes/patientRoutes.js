const express = require("express");
const {
  registerPatient,
  getPatients,
} = require("../controllers/patientController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, registerPatient);
router.get("/", protect, getPatients);

module.exports = router;
