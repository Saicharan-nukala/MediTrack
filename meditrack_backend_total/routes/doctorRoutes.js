const express = require("express");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Authentication routes
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
        res.status(500).json({ 
            message: "Server error", 
            error: err.message 
        });
    }
});

// Doctor CRUD operations
router.post("/add", async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(400).json({ 
            error: err.message 
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find().populate("patients");
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching doctors", 
            error: err.message 
        });
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
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

router.put("/:doctorId", async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { password, ...updates } = req.body;
        Object.assign(doctor, updates);

        if (password) {
            doctor.password = password;
        }

        await doctor.save();
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ 
            message: err.message 
        });
    }
});

// Patient-related routes
router.get("/:doctorId/patients", async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findById(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const patients = await Patient.find({ 
            _id: { $in: doctor.patients } 
        });

        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

router.get("/:doctorId/new-patients", async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await Doctor.findById(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const newPatients = await Patient.find({
            _id: { $in: doctor.patients },
            isNew: true
        });

        res.status(200).json(newPatients);
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error",
            error: error.message 
        });
    }
});

module.exports = router;