const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  joined_at: { type: Date, default: Date.now },
});

// Đảm bảo 1 student chỉ enroll 1 lần vào 1 class
enrollmentSchema.index({ student_id: 1, class_id: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
