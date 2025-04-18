const express = require("express");
const Patient = require("../models/patient");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'yourSecretKey';

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

// Login
router.post("/login", async (req, res) => {
  const { mailid, password } = req.body;

  try {
    const patient = await Patient.findOne({ mailid });
    if (!patient || !(await bcrypt.compare(password, patient.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: patient._id, mailid: patient.mailid }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token, patient });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  const patients = await Patient.find().populate("doctor");
  res.json(patients);
});

// Add multiple patients
router.post("/add-multiple", async (req, res) => {
  try {
    const patients = req.body;

    if (!Array.isArray(patients) || patients.length === 0) {
      return res.status(400).json({ message: "Invalid input: Expected an array of patients" });
    }

    const newPatients = await Patient.insertMany(patients);
    const patientIds = newPatients.map(patient => patient._id);

    res.status(201).json({
      message: `${newPatients.length} patients added successfully`,
      patientIds
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding patients", error: error.message });
  }
});

// Update patient
router.patch('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
});

// Get patient by ID (more complete version from second file)
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'name specialization' // Only get necessary fields
      });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving patient", error: error.message });
  }
});

module.exports = router;