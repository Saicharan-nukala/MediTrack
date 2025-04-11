const mongoose = require("mongoose");
const Doctor = require("./doctor");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  children: { type: Number, default: 0 },
  symptoms: { type: [String], default: [] },
  firstAppointment: { type: Date, required: true },
  lastAppointment: { type: Date, required: true },
  nextAppointment: { type: Date, default: null },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor", // ✅ Corrected model reference
    required: true
  },

  isNew: {
    type: Boolean,
    default: false
  },

  appointments: [
    {
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["past", "upcoming"],
        required: true
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
      }
    }
  ],

  ehrs: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true }
    }
  ]
}, { timestamps: true });


// ✅ Automatically add patient ID to doctor's patients[] on save
patientSchema.post("save", async function (doc, next) {
  try {
    await Doctor.findByIdAndUpdate(doc.doctor, {
      $addToSet: { patients: doc._id } // Prevents duplicates
    });
    next();
  } catch (err) {
    console.error("Error updating doctor's patient list:", err.message);
    next(err);
  }
});

module.exports = mongoose.model("Patient", patientSchema);
