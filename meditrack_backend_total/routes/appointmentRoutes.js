const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
// Appointment creation routes
router.post("/", async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: "Failed to create appointment", error: err.message });
    }
});

router.post('/add', async (req, res) => {
  try {
    const { patient, doctor, currentAppointmentDate } = req.body;

    // Validate date
    if (!currentAppointmentDate || isNaN(new Date(currentAppointmentDate))) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // 1. Create appointment
    const newAppointment = new Appointment({
      patient,
      doctor,
      currentAppointmentDate: new Date(currentAppointmentDate),
      isActive: true
    });
    await newAppointment.save();

    // 2. Update patient's doctor reference (let the post-save hook handle appointments)
    await Patient.findByIdAndUpdate(patient, { 
      doctor,
    });

    // 3. Explicitly add patient to doctor's list (as string and ObjectId)
    await Doctor.findByIdAndUpdate(doctor, { 
      $addToSet: { 
        patients: { 
          $each: [patient, patient.toString()] // Handle both formats
        } 
      } 
    });

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Error saving appointment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Doctor-related appointment routes
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId })
            .populate("patient")
            .sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

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

router.get("/activeappointments/doctor/:doctorId", async (req, res) => {
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

// Patient-related appointment routes
router.get("/patient/:patientId", async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId })
            .populate({
                path: 'doctor',
                select: 'name specialization'
            })
            .sort({ currentAppointmentDate: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching appointments", error: err.message });
    }
});

// Report-related routes
router.get("/pending-reports", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            isActive: true,
            isReportGenerated: false,
        })
        .populate("doctor patient")
        .sort({ currentAppointmentDate: -1 });

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching pending report appointments", 
            error: err.message 
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
// General appointment routes
router.get("/:id", async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate("doctor patient");
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching appointment", 
            error: err.message 
        });
    }
});

// Patient update route (consider moving to patientRoutes.js)
router.patch('/patients/:id', async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating patient", 
            error: error.message 
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