const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Patient = require('./models/patient'); // Adjust the path if needed

const MONGO_URI = 'mongodb://localhost:27017/meditrackDB'; // Replace with your actual MongoDB URI
const PATIENT_ID = '67fc9b6852d95461c860ef43'; // Target patient ID
const NEW_PASSWORD = '123'; // Set new plaintext password here

const updatePassword = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const patient = await Patient.findById(PATIENT_ID);
    if (!patient) {
      console.log('❌ Patient not found');
      return;
    }

    const isHashed = patient.password.startsWith('$2b$');
    if (isHashed) {
      console.log('ℹ️ Password already hashed. Overriding it with a new hashed password.');
    }

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    patient.password = hashedPassword;
    await patient.save();

    console.log(`✅ Password updated for patient: ${patient.name}`);
  } catch (err) {
    console.error('❌ Error updating password:', err);
  } finally {
    mongoose.disconnect();
  }
};

updatePassword();
