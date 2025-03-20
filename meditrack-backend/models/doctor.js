const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  specialization: String,
  experience: Number,
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  appointments: [{ type: Date }]
});

module.exports = mongoose.model("Doctor", doctorSchema);
