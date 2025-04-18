const express = require("express");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// POST /api/doctors/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      doctorId: doctor._id,
      name: doctor.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Create a new doctor
router.post("/add", async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  const doctors = await Doctor.find().populate("patients");
  res.json(doctors);
});

// Get all patients assigned to a specific doctor
router.get("/:doctorId/patients", async (req, res) => {
  try {
      const { doctorId } = req.params;

      // Find the doctor by ID
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
          return res.status(404).json({ message: "Doctor not found" });
      }

      // Fetch all patients whose IDs match the doctor's patient list
      const patients = await Patient.find({ _id: { $in: doctor.patients } });

      res.status(200).json(patients);
  } catch (error) {
      console.error("Error fetching doctor’s patients:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/:doctorId", async (req, res) => {
  try {
      const doctor = await Doctor.findById(req.params.doctorId);
      if (!doctor) {
          return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

router.put("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update fields manually (excluding password unless explicitly changed)
    const { password, ...updates } = req.body;
    Object.assign(doctor, updates);

    // Only update password if it was explicitly sent
    if (password) {
      doctor.password = password; // Will be hashed by pre('save') middleware
    }

    await doctor.save(); // ✅ Triggers password hashing middleware
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ Get only "new" patients assigned to a specific doctor
router.get("/:doctorId/new-patients", async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Fetch patients where doctor matches and isNew is true
    const newPatients = await Patient.find({
      _id: { $in: doctor.patients },
      isNew: true
    });

    res.status(200).json(newPatients);
  } catch (error) {
    console.error("Error fetching new patients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
