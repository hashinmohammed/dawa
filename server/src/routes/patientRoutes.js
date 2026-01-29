const express = require("express");
const {
  registerPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, registerPatient);
router.get("/", protect, getPatients);

router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, deletePatient);

module.exports = router;
