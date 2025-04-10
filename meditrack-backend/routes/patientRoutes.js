const express = require("express");
const Patient = require("../models/patient");
const router = express.Router();

// Create a new patient
router.post("/add", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  const patients = await Patient.find().populate("doctor");
  res.json(patients);
});

// ✅ API to add multiple patients and return only their IDs
router.post("/add-multiple", async (req, res) => {
    try {
        const patients = req.body; // Expecting an array of patients

        if (!Array.isArray(patients) || patients.length === 0) {
            return res.status(400).json({ message: "Invalid input: Expected an array of patients" });
        }

        // Insert multiple patients at once
        const newPatients = await Patient.insertMany(patients);

        // Extract only the patient IDs
        const patientIds = newPatients.map(patient => patient._id);

        res.status(201).json({
            message: `${newPatients.length} patients added successfully`,
            patientIds: patientIds
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding patients", error: error.message });
    }
});
// Get patient by ID
router.get("/:id", async (req, res) => {
  console.log("Fetching patient with ID:", req.params.id);
  try {
    const patient = await Patient.findById(req.params.id).populate("doctor");
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving patient", error: error.message });
  }
});

module.exports = router;
