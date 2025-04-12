const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  specialization: String,
  experience: Number,
  profilePic: String,
  signature: String,
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
});
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
module.exports = mongoose.model("Doctor", doctorSchema);
