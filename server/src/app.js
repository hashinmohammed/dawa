const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Allow all origins for debugging
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

module.exports = app;
