const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Appointment = require("./models/appointment");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const patientDoctorPairs = [
    { patient: "67f9568debf3f9275df44868", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f9568debf3f9275df4486c", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f9568debf3f9275df4486f", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f956d9b9dc7495f83f6df0", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6df4", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6df7", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6dfb", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6dfe", doctor: "67f94d5d8c41c37fbb762d80" },
    // plus 2 duplicates from earlier to reach 10
    { patient: "67f9503ff05529ec6732b718", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67cd6b4df6637dfbd4d3b84a", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f9568debf3f9275df44868", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f9568debf3f9275df4486c", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f9568debf3f9275df4486f", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f956d9b9dc7495f83f6df0", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6df4", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6df7", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6dfb", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f956dab9dc7495f83f6dfe", doctor: "67f94d5d8c41c37fbb762d80" },
    { patient: "67f9503ff05529ec6732b718", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67cd6b4df6637dfbd4d3b84a", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd670f12cc4704d602279d", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b846", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b84a", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b84e", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b852", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b856", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b85a", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b85e", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67cd6b4df6637dfbd4d3b862", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f7f4995173fd619b705d53", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f7f4995173fd619b705d54", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f7f4995173fd619b705d55", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f7f4995173fd619b705d56", doctor: "67cd6bebf6637dfbd4d3b867" },
    { patient: "67f9503af05529ec6732b70d", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67f9503ff05529ec6732b711", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67f9503ff05529ec6732b714", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67f9503ff05529ec6732b718", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67f9503ff05529ec6732b71b", doctor: "67f94d5c8c41c37fbb762d7c" },
    { patient: "67f9568bebf3f9275df44861", doctor: "67f94d5d8c41c37fbb762d7e" },
    { patient: "67f9568debf3f9275df44865", doctor: "67f94d5d8c41c37fbb762d7e" },
];

const sampleReports = [
    "Routine checkup completed.",
    "Symptoms improving, medication continued.",
    "Follow-up required for test results.",
    "New treatment prescribed.",
    "Patient referred for further diagnostics."
];

const sampleNotes = [
    "Patient advised lifestyle changes.",
    "Continue current medication.",
    "Schedule for blood test next visit.",
    "Monitor BP weekly.",
    "Follow-up in 1 month."
];

const getRandomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function seedAppointments() {
    try {
        for (const pair of patientDoctorPairs) {
            const current = getRandomDate(new Date("2024-04-01"), new Date("2024-05-01"));
            const last = new Date(current.getTime() - 1000 * 60 * 60 * 24 * (10 + Math.floor(Math.random() * 30)));
            const next = new Date(current.getTime() + 1000 * 60 * 60 * 24 * (15 + Math.floor(Math.random() * 30)));

            const appointment = await Appointment.create({
                patient: pair.patient,
                doctor: pair.doctor,
                lastAppointmentDate: last,
                currentAppointmentDate: current,
                nextAppointmentDate: next,
                report: sampleReports[Math.floor(Math.random() * sampleReports.length)],
                notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
                isActive: Math.random() < 0.6,
                isReportGenerated: Math.random() < 0.5
            });

            console.log(`✅ Appointment created for patient ${pair.patient}`);
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        mongoose.disconnect();
    }
}

seedAppointments();
