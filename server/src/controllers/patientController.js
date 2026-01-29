const Patient = require("../models/Patient");

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private
const registerPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      sex,
      phoneNumber,
      whatsappNumber,
      place,
      department,
      doctor,
    } = req.body;

    const patient = await Patient.create({
      name,
      age,
      sex,
      phoneNumber,
      whatsappNumber: whatsappNumber || phoneNumber,
      place,
      department,
      doctor,
      registeredBy: req.user._id,
      createdByRole: req.user.role,
    });

    // Populate the registeredBy field to get user details
    await patient.populate("registeredBy", "name email role");

    res.status(201).json({
      message: "Patient registered successfully",
      patient: {
        _id: patient._id,
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        phoneNumber: patient.phoneNumber,
        whatsappNumber: patient.whatsappNumber,
        place: patient.place,
        department: patient.department,
        doctor: patient.doctor,
        createdAt: patient.createdAt,
        createdBy: {
          _id: patient.registeredBy._id,
          name: patient.registeredBy.name,
          email: patient.registeredBy.email,
          role: patient.registeredBy.role,
        },
        createdByRole: patient.createdByRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Patient.countDocuments();
    const patients = await Patient.find()
      .populate("registeredBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      patients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPatients: total,
        patientsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatients,
};
