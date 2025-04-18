const mongoose = require("mongoose");
const Doctor = require("./doctor");
const bcrypt = require('bcrypt');

const patientSchema = new mongoose.Schema({
  name: { type: String, default: null },
  gender: { type: String, default: null },
  age: { type: Number, default: null },
  condition: { type: String, default: null },
  mailid: { type: String, default: null },
  password: { type: String, default: null },
  maritalStatus: { type: String, default: null },
  children: { type: Number, default: null },
  symptoms: { type: [String], default: [] },

  firstAppointment: { type: Date, default: null },
  lastAppointment: { type: Date, default: null },
  nextAppointment: { type: Date, default: null },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    default: null
  },

  isNew: {
    type: Boolean,
    default: true
  },

  appointments: [
    {
      date: { type: Date, default: null },
      status: {
        type: String,
        enum: ["past", "upcoming"],
        default: null
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null
      }
    }
  ],

  ehrs: [
    {
      name: { type: String, default: null },
      url: { type: String, default: null }
    }
  ],
  activeAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    default: null
  }
}, { timestamps: true });

// Automatically add patient ID to doctor's patients[] on save
patientSchema.post("save", async function (doc, next) {
  try {
    if (doc.doctor) {
      await Doctor.findByIdAndUpdate(doc.doctor, {
        $addToSet: { patients: doc._id }
      });
    }
    next();
  } catch (err) {
    console.error("Error updating doctor's patient list:", err.message);
    next(err);
  }
});

//bycrypt password before saving
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model("Patient", patientSchema);