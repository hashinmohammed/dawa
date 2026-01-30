const Patient = require("../models/Patient");

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      if (fromDate) dateFilter.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.createdAt.$lte = endOfDay;
      }
    }

    // 1. Total Patients
    const totalPatients = await Patient.countDocuments(dateFilter);

    // 2. New Patients Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newPatientsToday = await Patient.countDocuments({
      createdAt: { $gte: today },
    });

    // 3. Patients by Department (Pie Chart) - Apply Filter
    const patientsByDepartment = await Patient.aggregate([
      {
        $match: dateFilter, // Apply filter here
      },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0,
        },
      },
    ]);

    // 4. Registration History (Bar/Line Chart) - Apply Filter or Default 6 Months
    let historyMatch = {};

    if (fromDate || toDate) {
      historyMatch = dateFilter;
    } else {
      // Default: Last 6 Months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      historyMatch = { createdAt: { $gte: sixMonthsAgo } };
    }

    const registrationHistory = await Patient.aggregate([
      {
        $match: historyMatch,
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          date: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.month", 10] },
                  then: { $concat: ["0", { $toString: "$_id.month" }] },
                  else: { $toString: "$_id.month" },
                },
              },
            ],
          },
          count: "$count",
          _id: 0,
        },
      },
    ]);

    res.json({
      totalPatients,
      newPatientsToday,
      patientsByDepartment,
      registrationHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const User = require("../models/User");

// @desc    Get User Statistics (Dynamic Roles)
// @route   GET /api/admin/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Group users by role
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      totalUsers,
      roleStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Users List
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.role === "admin" &&
      (await User.countDocuments({ role: "admin" })) <= 1
    ) {
      return res.status(400).json({ message: "Cannot delete the last admin" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update User Status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Setting = require("../models/Setting");

// @desc    Get All Settings (Roles, Departments)
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    let roles = await Setting.findOne({ key: "roles" });
    let departments = await Setting.findOne({ key: "departments" });
    let places = await Setting.findOne({ key: "places" });
    let signupFlags = await Setting.findOne({ key: "signup_flags" });

    // Initialize defaults if not present
    if (!roles) {
      roles = await Setting.create({
        key: "roles",
        values: ["admin", "doctor", "nurse"],
      });
    }

    if (!departments) {
      departments = await Setting.create({
        key: "departments",
        values: ["General", "Cardiology", "Pediatrics", "Dental"],
      });
    }

    if (!places) {
      places = await Setting.create({
        key: "places",
        values: ["Kasaragod", "Kanhangad", "Payyanur"],
      });
    }

    if (!signupFlags) {
      signupFlags = await Setting.create({
        key: "signup_flags",
        values: ["admin_signup"], // Enabled by default
      });
    }

    res.json({
      roles: roles.values,
      departments: departments.values,
      places: places.values,
      signupFlags: signupFlags.values,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a value to a setting (role or department)
// @route   POST /api/admin/settings
// @access  Private/Admin
const addSettingValue = async (req, res) => {
  try {
    const { key, value } = req.body; // key: 'roles' or 'departments'

    if (!key || !value) {
      return res.status(400).json({ message: "Key and value are required" });
    }

    const setting = await Setting.findOne({ key });
    if (!setting) {
      return res.status(404).json({ message: "Setting category not found" });
    }

    if (setting.values.includes(value)) {
      return res.status(400).json({ message: "Value already exists" });
    }

    setting.values.push(value);
    await setting.save();

    res.json(setting.values);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a value from a setting
// @route   DELETE /api/admin/settings/:key/:value
// @access  Private/Admin
const deleteSettingValue = async (req, res) => {
  try {
    const { key, value } = req.params;

    const setting = await Setting.findOne({ key });
    if (!setting) {
      return res.status(404).json({ message: "Setting category not found" });
    }

    // Prevent deleting "admin" role
    if (key === "roles" && value === "admin") {
      return res.status(400).json({ message: "Cannot delete 'admin' role" });
    }

    setting.values = setting.values.filter((v) => v !== value);
    await setting.save();

    res.json(setting.values);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUserStats,
  getAllUsers,
  deleteUser,
  getSettings,
  addSettingValue,
  deleteSettingValue,
  updateUserStatus,
};
