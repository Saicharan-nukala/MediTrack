const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Doctor = require("./models/doctor");
require("dotenv").config();
// This is Not Orignal Method this is manul method to re write the password 
async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const doctorId = "67f94d5d8c41c37fbb762d80"; // place the doctorId to update the password
    const newPlainPassword = "priya123";  // give new password here

    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    const updated = await Doctor.findByIdAndUpdate(
      doctorId,
      { password: hashedPassword },
      { new: true }
    );

    if (updated) {
      console.log(`🔐 Password updated for: ${updated.password}`);
    } else {
      console.log("❌ Doctor not found.");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

updatePassword();
