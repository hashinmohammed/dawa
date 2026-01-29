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

    // Build filter query
    const filter = {};

    // Filter by department
    if (req.query.department) {
      filter.department = req.query.department;
    }

    // Filter by doctor
    if (req.query.doctor) {
      filter.doctor = { $regex: req.query.doctor, $options: "i" };
    }

    // Search by name (case-insensitive)
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    // Filter by date (records created on selected date)
    if (req.query.date) {
      const selectedDate = new Date(req.query.date);
      // Create separate date objects to avoid mutation issues
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Determine sort order (default: newest first)
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .populate("registeredBy", "name email role")
      .sort({ createdAt: sortOrder })
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

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update fields
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // Return updated document
    );

    res.json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.json({ message: "Patient removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatients,
  updatePatient,
  deletePatient,
};
