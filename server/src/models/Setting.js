const mongoose = require("mongoose");

const settingSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g., 'roles', 'departments'
    },
    values: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
