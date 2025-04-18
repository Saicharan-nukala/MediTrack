import { useEffect, useState } from "react";
import { fetchPatient, updatePatient } from "../apiService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarPatient from "./Navbarpatient";
import "../App.css";
import logo from "../assets/images/m_logo.jpeg";

const PatientProfile = () => {
    const patientId = localStorage.getItem("patientId");
    const [patient, setPatient] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getDetails = async () => {
            const data = await fetchPatient(patientId);
            if (data) setPatient(data);
        };
        getDetails();
    }, [patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        setPatient((prev) => ({ 
            ...prev, 
            [name]: value.split(',').map(item => item.trim()) 
        }));
    };

    const toggleEdit = async () => {
        if (editMode) {
            try {
                const updated = await updatePatient(patientId, patient);
                if (updated) {
                    toast.success("Profile updated successfully!");
                    setPatient(updated);
                    localStorage.setItem('patientInfo', JSON.stringify(updated));
                }
            } catch (error) {
                toast.error("Update failed. Please try again.");
                console.error("Update error:", error);
            }
        }
        setEditMode(!editMode);
    };

    const handleLogout = () => {
        localStorage.removeItem("patientId");
        localStorage.removeItem("patientToken");
        localStorage.removeItem("patientInfo");
        navigate("/");
    };

    if (!patient) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-container">
            <NavbarPatient navbarColor="#649cac" logoUrl={logo} />
            
            <div className="profile-content">
                <h2 className="profile-title">Patient Profile</h2>

                <div className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={patient.name || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <input
                            type="text"
                            name="gender"
                            value={patient.gender || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={patient.age || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="mailid"
                            value={patient.mailid || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Condition</label>
                        <input
                            type="text"
                            name="condition"
                            value={patient.condition || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Symptoms (comma separated)</label>
                        <input
                            type="text"
                            name="symptoms"
                            value={patient.symptoms?.join(', ') || ""}
                            onChange={handleArrayChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Marital Status</label>
                        <input
                            type="text"
                            name="maritalStatus"
                            value={patient.maritalStatus || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Children</label>
                        <input
                            type="number"
                            name="children"
                            value={patient.children || ""}
                            onChange={handleChange}
                            readOnly={!editMode}
                            className={editMode ? "editable" : "readonly"}
                        />
                    </div>
                </div>

                <div className="profile-actions">
                    <button onClick={toggleEdit} className="edit-btn">
                        {editMode ? "Save Changes" : "Edit Profile"}
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default PatientProfile;