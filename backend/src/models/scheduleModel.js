const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  location: { type: String, required: false, default: "" },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled", "rescheduled"],
    default: "scheduled",
  },
  note: { type: String, required: false, default: "" },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
