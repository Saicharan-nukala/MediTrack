const express = require("express");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const router = express.Router();

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

module.exports = router;
