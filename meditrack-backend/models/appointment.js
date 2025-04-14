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
  pdfReport: {
    file: { 
      type: String,
      validate: {
        validator: function(v) {
          // Basic PDF validation (first 6 chars should be 'JVBERi')
          return !v || v.startsWith('JVBERi');
        },
        message: 'Uploaded file is not a valid PDF'
      }
    },
    uploadedAt: {
      type: Date,
      default: null
    }
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
appointmentSchema.pre("save", async function (next) {
  try {
    // Check only if this appointment is marked as active
    if (this.isActive) {
      const existingActive = await mongoose.model("Appointment").findOne({
        patient: this.patient,
        isActive: true,
        _id: { $ne: this._id }, // exclude current one if updating
      });

      if (existingActive) {
        const err = new Error("This patient already has an active appointment.");
        return next(err); // ❌ Block save
      }
    }

    next(); // ✅ Continue if no conflict
  } catch (err) {
    next(err); // ❌ Catch any DB errors
  }
});
// Middleware to handle appointment activation/deactivation
appointmentSchema.pre("save", async function (next) {
  try {
    if (this.isModified('isActive') || this.isModified('currentAppointmentDate')) {
      const patientUpdate = {};
      
      // When activating an appointment
      if (this.isActive) {
        // Check for existing active appointment
        const existingActive = await mongoose.model("Appointment").findOne({
          patient: this.patient,
          isActive: true,
          _id: { $ne: this._id }
        });

        if (existingActive) {
          const err = new Error("Patient already has an active appointment");
          return next(err);
        }

        // Set as active appointment and update nextAppointment
        patientUpdate.activeAppointment = this._id;
        patientUpdate.nextAppointment = this.currentAppointmentDate;
      }
      // When deactivating an appointment
      else if (this.isModified('isActive')) {
        patientUpdate.lastAppointment = this.currentAppointmentDate;
        patientUpdate.activeAppointment = null;
        // Don't modify nextAppointment here - it might have been set for future
      }

      // If current date changed on active appointment, update nextAppointment
      if (this.isActive && this.isModified('currentAppointmentDate')) {
        patientUpdate.nextAppointment = this.currentAppointmentDate;
      }

      if (Object.keys(patientUpdate).length > 0) {
        await Patient.findByIdAndUpdate(this.patient, {
          $set: patientUpdate
        });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Handle appointment deletion
appointmentSchema.post("remove", async function (doc, next) {
  try {
    if (doc.isActive) {
      await Patient.findByIdAndUpdate(doc.patient, {
        $set: { 
          lastAppointment: doc.currentAppointmentDate,
          activeAppointment: null
          // Don't clear nextAppointment as it might reference another appointment
        }
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});

appointmentSchema.pre('save', async function(next) {
  if (this.isModified('pdfReport.file') && this.pdfReport?.file) {
    try {
      // 1. Validate PDF
      if (!this.pdfReport.file.startsWith('JVBERi')) {
        throw new Error('Invalid PDF file');
      }

      // 2. Update report status and deactivate
      this.isReportGenerated = true;
      this.isActive = false;
      this.pdfReport.uploadedAt = new Date();

      // 3. Update patient's activeAppointment to null if this was their active appointment
      const patient = await Patient.findById(this.patient);
      if (patient && patient.activeAppointment && patient.activeAppointment.equals(this._id)) {
        await Patient.findByIdAndUpdate(this.patient, {
          $set: { activeAppointment: null }
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
module.exports = mongoose.model("Appointment", appointmentSchema);
