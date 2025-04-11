const mongoose = require("mongoose");
const Patient = require("./patient");
const Doctor = require("./doctor");
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String },
  doctorName: { type: String },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  lastAppointmentDate: {
    type: Date,
  },
  currentAppointmentDate: {
    type: Date,
    required: true,
  },
  nextAppointmentDate: {
    type: Date,
  },
  report: {
    type: String, // can be a summary or file reference
  },
  notes: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true, // true means upcoming/in-progress
  },

  isReportGenerated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


appointmentSchema.post("save", async function (doc, next) {
  try {
    const appointmentEntry = {
      date: doc.currentAppointmentDate,
      status: doc.isActive ? "upcoming" : "past",
      appointmentId: doc._id
    };

    await Patient.findByIdAndUpdate(doc.patient, {
      $push: { appointments: appointmentEntry }
    });

    next();
  } catch (err) {
    console.error("❌ Error updating patient's appointment list:", err.message);
    next(err);
  }
});
// 🧠 Middleware to auto-fill doctorName and patientName
appointmentSchema.pre("save", async function (next) {
  if (!this.isModified("doctor") && !this.isModified("patient")) {
    return next(); // Skip if doctor/patient not modified
  }

  try {
    const doctor = await Doctor.findById(this.doctor);
    const patient = await Patient.findById(this.patient);

    if (doctor) this.doctorName = doctor.name;
    if (patient) this.patientName = patient.name;

    next();
  } catch (err) {
    console.error("❌ Error populating names in appointment:", err.message);
    next(err);
  }
});
module.exports = mongoose.model("Appointment", appointmentSchema);
