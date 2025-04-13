import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust if needed

// ✅ Fetch all patients for a specific doctor
export const fetchDoctorPatients = async (doctorId) => {
  try {
    if (!doctorId) {
      throw new Error("Doctor ID is required");
    }

    const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}/patients`);
    return response.data; // Returns an array of patients
  } catch (error) {
    console.error("Error fetching doctor's patients:", error.response?.data || error.message);
    return []; // Return empty array on error
  }
};
export const fetchDoctorDetails = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}`);
    return response.data; // Returns doctor details
  } catch (error) {
    console.error("Error fetching doctor details:", error);
    return null;
  }
};
export const updateDoctorDetails = async (doctorId, updatedData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Failed to update doctor");

    return await res.json();
  } catch (error) {
    console.error("Update Error:", error);
    return null;
  }
};
// ✅ Fetch patient details by ID
export const fetchPatientById = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`);
    return response.data; // Returns patient details
  } catch (error) {
    console.error("Error fetching patient details:", error.response?.data || error.message);
    return null;
  }
};
export const getNewPatientsByDoctor = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}/new-patients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching new patients:", error);
    throw error;
  }
};

// ✅ Fetch all active appointments for a specific doctor returns all the patints
export const getActiveAppointmentPatientsByDoctor = async (doctorId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments/active/doctor/${doctorId}`);
    if (!res.ok) throw new Error("Failed to fetch active patients");
    return await res.json();
  } catch (err) {
    console.error("Error fetching active patients for doctor:", err);
    return [];
  }
};

// Fetch active appointments for a doctor returns all active appointmnets
export const getActiveAppointmentsByDoctor = async (doctorId) => {
  try {
      const res = await fetch(`${API_BASE_URL}/appointments/activeappoinmetns/doctor/${doctorId}`);
      if (!res.ok) throw new Error("Failed to fetch active appointments");
      const data = await res.json();
      
      return data.map(app => ({
          ...app,
          currentAppointmentDate: new Date(app.currentAppointmentDate),
          lastAppointmentDate: app.lastAppointmentDate ? new Date(app.lastAppointmentDate) : null,
          nextAppointmentDate: app.nextAppointmentDate ? new Date(app.nextAppointmentDate) : null,
          patient: app.patient || { name: 'Unknown Patient' },
          doctor: app.doctor || { name: 'Unknown Doctor' }
      }));
  } catch (err) {
      console.error("Error fetching active appointments:", err);
      return [];
  }
};


// ✅ Fetch appointments where isActive = true AND isReportGenerated = false
export const getAppointmentsWithPendingReports = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/pending-reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending report appointments:", error.response?.data || error.message);
    return [];
  }
};

export const getPatientsWithActiveUnreportedAppointments = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/active-unreported/doctor/${doctorId}`);
    return response.data.map(app => ({
      ...app.patient,              // patient details
      appointmentId: app._id,      // grab appointment ID
    }));
  } catch (err) {
    console.error("Error fetching unreported active patients:", err);
    return [];
  }
};
// ✅ Fetch pending report appointments for a specific doctor
export const getPendingReportAppointmentsByDoctor = async (doctorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointments/pending-reports/doctor/${doctorId}`);
    
    // Transform data with proper date handling
    return response.data.map(appointment => ({
      ...appointment,
      currentAppointmentDate: new Date(appointment.currentAppointmentDate),
      lastAppointmentDate: appointment.lastAppointmentDate ? 
        new Date(appointment.lastAppointmentDate) : null,
      nextAppointmentDate: appointment.nextAppointmentDate ? 
        new Date(appointment.nextAppointmentDate) : null,
      // Ensure patient object exists
      patient: appointment.patient || { 
        _id: 'unknown', 
        name: 'Unknown Patient' 
      }
    }));
    
  } catch (error) {
    console.error(
      "Error fetching pending report appointments:", 
      error.response?.data?.message || error.message
    );
    return []; // Always return array to prevent frontend crashes
  }
};
export const uploadPdfReport = async (appointmentId, file) => {
  try {
    // 1. Validate inputs
    if (!appointmentId || !file) {
      throw new Error('Appointment ID and file are required');
    }

    // 2. Convert file to Base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    // 3. Send to backend
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ pdfBase64: base64Data })
    });

    // 4. Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error; // Re-throw for handling in component
  }
};
export const getAllAppointmentsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments for patient:", error.response?.data || error.message);
    return [];
  }
};
