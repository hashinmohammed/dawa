const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, department } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const Setting = require("../models/Setting");
    const signupFlags = await Setting.findOne({ key: "signup_flags" });
    const isManualApproval =
      signupFlags && signupFlags.values.includes("manual_approval");

    // If user is admin, they are always active (or maybe first admin is active?)
    // Let's assume admin role signup is protected by other means or only enabled explicitly
    // But per prompt, "any role except admin roles should take from added roles", implies admin is special.
    // Let's keep admin active for safety if they manage to sign up (since admin signup is toggled).
    // Or just apply to all? Let's apply to all non-first-admin if we want strictness.
    // Simple approach: Apply to all. But careful with initial setup.
    // User passed prompt: "in users at admin when a user signup need to allow or disallow can be done by admin manually"

    const status = isManualApproval ? "pending" : "active";

    const user = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      department: role === "admin" ? "" : req.body.department,
      status, // Default is active in schema, but we override here
    });

    if (user) {
      if (status === "pending") {
        return res.status(201).json({
          message:
            "Account created successfully. Please wait for admin approval.",
          pending: true,
        });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Store refresh token in database
      user.refreshTokens.push({ token: refreshToken });
      await user.save({ validateBeforeSave: false });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        status: user.status,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status && user.status !== "active") {
        return res.status(403).json({
          message:
            user.status === "pending"
              ? "Your account is pending approval. Please contact admin."
              : "Your account has been rejected or suspended.",
        });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Store refresh token in database
      user.refreshTokens.push({ token: refreshToken });
      await user.save({ validateBeforeSave: false });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.find((t) => t.token === refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user._id);

    // Remove refresh token from DB
    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.token !== refreshToken,
    );
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout,
  getUserProfile,
};
