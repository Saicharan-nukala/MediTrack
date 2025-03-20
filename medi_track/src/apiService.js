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

// ✅ Example Usage (Call this function in your component)
const doctorId = "67cd6bebf6637dfbd4d3b867"; // Replace with actual doctor ID

const testFetchPatients = async () => {
    const patients = await fetchDoctorPatients(doctorId);
    console.log("Doctor's Patients:", patients);
};

testFetchPatients(); // Call function to check if it works
