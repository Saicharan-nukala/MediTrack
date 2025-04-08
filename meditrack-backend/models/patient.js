const mongoose = require("mongoose");

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
    // List of all appointments
    appointments: [
        {
            date: { type: Date, required: true },
            status: { type: String, enum: ["past", "upcoming"], required: true } // "past" or "upcoming"
        }
    ],

    ehrs: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true }
        }
    ]
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;


module.exports = mongoose.model("Patient", patientSchema);
