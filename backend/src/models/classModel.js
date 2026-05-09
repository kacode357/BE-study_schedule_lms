const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: false, default: "" },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Class", classSchema);
