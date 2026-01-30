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

module.exports = {
  getDashboardStats,
  getUserStats,
  getAllUsers,
  deleteUser,
};
