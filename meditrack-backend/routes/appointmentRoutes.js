const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
// Create appointment
router.post("/", async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: "Failed to create appointment", error: err.message });
    }
});

// Get all appointments for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate("patient").sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

// Get all appointments for a patient
router.get("/patient/:patientId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId }).populate("doctor").sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});
// make sure this is imported

// 1️⃣ Get all patients with active appointments for a doctor
router.get("/active/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctor: req.params.doctorId,
            isActive: true
        });

        const patientIds = [...new Set(appointments.map(app => app.patient.toString()))];
        const patients = await Patient.find({ _id: { $in: patientIds } });

        res.status(200).json(patients);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching active appointment patients",
            error: err.message
        });
    }
});
// Get all active appointments for a doctor (updated version)
router.get("/activeappoinmetns/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctor: req.params.doctorId,
            isActive: true
        })
        .populate('patient')
        .populate('doctor')
        .sort({ currentAppointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching active appointments",
            error: err.message
        });
    }
});

// 2️⃣ Get appointments where isActive=true AND isReportGenerated=false
router.get("/pending-reports", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            isActive: true,
            isReportGenerated: false,
        }).populate("doctor patient").sort({ currentAppointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching pending report appointments", error: err.message });
    }
});
// 🧠 Get patients with active appointments that don't have reports for a specific doctor
router.get("/active-unreported/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await Appointment.find({
        doctor: req.params.doctorId,
        isActive: true,
        isReportGenerated: false,
      }).populate("patient");
  
      res.status(200).json(appointments); // send full appointment with patient
    } catch (err) {
      res.status(500).json({
        message: "Error fetching patients with unreported active appointments",
        error: err.message,
      });
    }
  });
  // Get appointments with pending reports for a specific doctor
router.get("/pending-reports/doctor/:doctorId", async (req, res) => {
    try {
      const appointments = await Appointment.find({
        doctor: req.params.doctorId,
        isActive: true,
        isReportGenerated: false
      })
      .populate("patient", "name email phone") // Only include essential patient fields
      .populate("doctor", "name specialization")
      .sort({ currentAppointmentDate: -1 }); // Newest first
  
      res.status(200).json(appointments);
    } catch (err) {
      console.error("Error fetching pending report appointments:", err);
      res.status(500).json({ 
        message: "Error fetching pending report appointments",
        error: err.message
      });
    }
  });
  router.post('/:id/report', async (req, res) => {
    try {
      const { id } = req.params;
      const { pdfBase64 } = req.body;
  
      if (!pdfBase64) {
        return res.status(400).json({ error: 'PDF data is required' });
      }
  
      const appointment = await Appointment.findByIdAndUpdate(
        id,
        {
          $set: {
            'pdfReport.file': pdfBase64,
            isReportGenerated: true,
            isActive: false
          }
        },
        { new: true }
      );
  
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
  
      // Update patient's activeAppointment if this was their active appointment
      const patient = await Patient.findById(appointment.patient);
      if (patient && patient.activeAppointment && patient.activeAppointment.equals(appointment._id)) {
        await Patient.findByIdAndUpdate(appointment.patient, {
          $set: { activeAppointment: null }
        });
      }
  
      res.json({ success: true, appointment });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;
