const mongoose = require("mongoose");
const Patient = require("./patient");
const Doctor = require("./doctor");

const appointmentSchema = new mongoose.Schema({
  // Reference Information
  patientName: { 
    type: String 
  },
  doctorName: { 
    type: String 
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

  // Appointment Dates
  lastAppointmentDate: {
    type: Date
  },
  currentAppointmentDate: {
    type: Date,
    required: true
  },
  nextAppointmentDate: {
    type: Date
  },

  // Medical Information
  report: {
    type: String
  },
  notes: {
    type: String
  },
  pdfReport: {
    file: { 
      type: String,
      validate: {
        validator: function(v) {
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

  // Status Flags
  isActive: {
    type: Boolean,
    default: true
  },
  isReportGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Pre-save hooks
appointmentSchema.pre("save", async function(next) {
  try {
    // Auto-fill names if not set
    if ((!this.doctorName && this.isModified("doctor")) || !this.doctorName) {
      const doctor = await Doctor.findById(this.doctor);
      if (doctor) this.doctorName = doctor.name;
    }

    if ((!this.patientName && this.isModified("patient")) || !this.patientName) {
      const patient = await Patient.findById(this.patient);
      if (patient) this.patientName = patient.name;
    }

    // Validate only one active appointment per patient
    if (this.isActive) {
      const existingActive = await mongoose.model("Appointment").findOne({
        patient: this.patient,
        isActive: true,
        _id: { $ne: this._id }
      });

      if (existingActive) {
        throw new Error("Patient already has an active appointment");
      }
    }

    // Handle PDF report upload
    if (this.isModified('pdfReport.file') && this.pdfReport?.file) {
      this.isReportGenerated = true;
      this.isActive = false;
      this.pdfReport.uploadedAt = new Date();
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Post-save hook to update patient record
appointmentSchema.post("save", async function(doc, next) {
  try {
    const updatePayload = {
      $push: { 
        appointments: {
          date: doc.currentAppointmentDate,
          status: doc.isActive ? "upcoming" : "past",
          appointmentId: doc._id
        }
      },
      $set: {}
    };

    // Handle active appointment status
    if (doc.isActive) {
      updatePayload.$set.activeAppointment = doc._id;
      updatePayload.$set.nextAppointment = doc.currentAppointmentDate;
    } else if (this.isModified('isActive')) {
      updatePayload.$set.lastAppointmentDate = doc.currentAppointmentDate;
      updatePayload.$set.activeAppointment = null;
    }

    // Handle new patient assignment
    const patient = await Patient.findById(doc.patient);
    if (patient && patient.isNew && !patient.doctor) {
      updatePayload.$set.doctor = doc.doctor;
    }

    // Only mark patient as not new after second appointment (changed from >=1 to >=2)
    if (patient && patient.appointments && patient.appointments.length >= 2) {
      updatePayload.$set.isNew = false;
    }

    await Patient.findByIdAndUpdate(doc.patient, updatePayload);
    next();
  } catch (err) {
    console.error("Error updating patient record:", err.message);
    next(err);
  }
});

// Post-remove hook to clean up patient record
appointmentSchema.post("remove", async function(doc, next) {
  try {
    if (doc.isActive) {
      await Patient.findByIdAndUpdate(doc.patient, {
        $set: { 
          lastAppointmentDate: doc.currentAppointmentDate,
          activeAppointment: null
        }
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Add virtual for appointment status
appointmentSchema.virtual('status').get(function() {
  if (this.isActive) return 'active';
  if (this.isReportGenerated) return 'completed';
  return 'pending';
});

module.exports = mongoose.model("Appointment", appointmentSchema);