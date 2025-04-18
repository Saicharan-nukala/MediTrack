const API_URL = 'http://localhost:5000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error("Expected JSON but got:", text, "| Status:", response.status);
    throw new Error(`Unexpected response format from server: ${text}`);
  }
  

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
};

export const fetchDoctor = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/api/doctors/${doctorId}`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw new Error(error.message || 'Failed to load doctor information');
  }
};
// Helper function to format dates consistently
const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString();
};

export const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_URL}/api/doctors`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw new Error(error.message || 'Failed to fetch doctors list');
  }
};

export const registerPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_URL}/api/patients/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Patient registration failed');
  }
};

export const loginPatient = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/patients/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse(response);
    
    // Store ALL required patient data
    localStorage.setItem('patientToken', data.token);
    localStorage.setItem('patientId', data.patient._id);
    localStorage.setItem('patientInfo', JSON.stringify(data.patient));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const bookAppointment = async (appointmentData) => {
  try {
    // Format date before sending
    const formattedData = {
      ...appointmentData,
      currentAppointmentDate: formatDateForAPI(appointmentData.currentAppointmentDate)
    };

    const response = await fetch(`${API_URL}/api/appointments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(formattedData),
    });
    
    const data = await handleResponse(response);
    
    // Check if this is the first appointment and update doctor's patient list if needed
    if (appointmentData.patient && appointmentData.doctor) {
      // First check if we need to update local storage
      if (!localStorage.getItem('patientId')) {
        localStorage.setItem('patientId', appointmentData.patient);
      }
      
      // Then make sure patient is added to doctor's list
      try {
        await fetch(`${API_URL}/api/patients/${appointmentData.patient}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            doctor: appointmentData.doctor,
          }),
        });
      } catch (updateError) {
        console.error('Error updating patient doctor reference:', updateError);
        // Don't throw here as the appointment was successfully booked
      }
    }
    
    return data;
  } catch (error) {
    console.error('Booking error:', error);
    throw new Error(error.message || 'Failed to book appointment');
  }
};
export const fetchPatientDetails = async (patientId) => {
  try {
      const response = await fetch(`${API_BASE}/patients/${patientId}`);
      if (!response.ok) throw new Error("Failed to fetch patient details");
      return await response.json();
  } catch (error) {
      console.error("Fetch Error:", error);
      return null;
  }
};

export const updatePatientDetails = async (patientId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE}/patients/${patientId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Failed to update patient details");
      return await response.json();
  } catch (error) {
      console.error("Update Error:", error);
      return null;
  }
};
export const fetchPatientAppointments = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/api/appointments/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    
    // Format dates for display and sort by date
    return data
      .map(appt => ({
        ...appt,
        currentAppointmentDate: new Date(appt.currentAppointmentDate).toISOString()
      }))
      .sort((a, b) => new Date(b.currentAppointmentDate) - new Date(a.currentAppointmentDate));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new Error(error.message || 'Failed to load appointments');
  }
};
export const fetchAppointmentById = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/api/appointments/${appointmentId}`, {
      headers: getAuthHeaders()
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`Failed to fetch appointment ${appointmentId}`, error);
    return null;
  }
};


export const fetchPatient = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/api/patients/${patientId}`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    
    // Update local storage with fresh patient data
    if (data) {
      localStorage.setItem('patientInfo', JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw new Error(error.message || 'Failed to load patient information');
  }
};

export const updatePatient = async (patientId, updateData) => {
  try {
    const response = await fetch(`${API_URL}/api/patients/${patientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(updateData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating patient:', error);
    throw new Error(error.message || 'Failed to update patient record');
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('patientToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add logout functionality
export const logoutPatient = () => {
  localStorage.removeItem('patientToken');
  localStorage.removeItem('patientInfo');
  localStorage.removeItem('patientId');
};