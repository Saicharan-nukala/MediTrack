import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorDetails ,updateDoctorDetails} from "../../apiService";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
    const doctorId = localStorage.getItem("doctorId"); // Replace with dynamic ID if needed
    const [doctor, setDoctor] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("doctorId");
        localStorage.removeItem("doctorToken");
        navigate("/login");
    };
    useEffect(() => {
        const getDoctorDetails = async () => {
            const data = await fetchDoctorDetails(doctorId);
            if (data) setDoctor(data);
        };
        getDoctorDetails();
    }, []);

    if (!doctor) return <div>Loading...</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setDoctor((prev) => ({ ...prev, [field]: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (field) => {
        setDoctor((prev) => ({ ...prev, [field]: "" }));
    };

    const toggleEdit = async () => {
        if (editMode) {
            const updated = await updateDoctorDetails(doctorId, doctor);
            if (updated) {
                toast.success("Profile updated successfully!");
                setDoctor(updated);
            } else {
                alert("Update failed. Try again.");
            }
        }
        setEditMode(!editMode);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Doctor Profile</h2>

            {/* Profile Picture */}
            <div style={styles.imageGroup}>
                <label style={styles.label}>Profile Picture</label>
                <div style={styles.imageRow}>
                    <img
                        src={doctor.profilePic || "https://via.placeholder.com/100x100?text=No+Image"}
                        alt="Profile"
                        style={styles.image}
                    />
                    {editMode && (
                        <div style={styles.btnGroup}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "profilePic")}
                                style={styles.fileInput}
                            />
                            <button onClick={() => handleRemoveImage("profilePic")} style={styles.removeBtn}>
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Signature */}
            <div style={styles.imageGroup}>
                <label style={styles.label}>Signature</label>
                <div style={styles.imageRow}>
                    <img
                        src={doctor.signature || "https://via.placeholder.com/100x50?text=No+Signature"}
                        alt="Signature"
                        style={{ ...styles.image, height: "50px" }}
                    />
                    {editMode && (
                        <div style={styles.btnGroup}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "signature")}
                                style={styles.fileInput}
                            />
                            <button onClick={() => handleRemoveImage("signature")} style={styles.removeBtn}>
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {/* Text Fields */}
            <div style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input type="text" value={doctor.name} readOnly style={styles.readonlyInput} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input type="email" value={doctor.email} readOnly style={styles.readonlyInput} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={doctor.password}
                        onChange={handleChange}
                        readOnly={!editMode}
                        style={editMode ? styles.input : styles.readonlyInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Specialization</label>
                    <input
                        type="text"
                        name="specialization"
                        value={doctor.specialization}
                        onChange={handleChange}
                        readOnly={!editMode}
                        style={editMode ? styles.input : styles.readonlyInput}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Experience (years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={doctor.experience}
                        onChange={handleChange}
                        readOnly={!editMode}
                        style={editMode ? styles.input : styles.readonlyInput}
                    />
                </div>
            </div>

            <div style={styles.buttonContainer}>
                <button onClick={toggleEdit} style={styles.button}>
                    {editMode ? "Save Changes" : "Edit Profile"}
                </button>
            </div>
            <div style={styles.buttonContainer}>
                <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: "#f44336" }}>
                    Logout
                </button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "60vw",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "Segoe UI, sans-serif",
    },
    title: {
        textAlign: "center",
        color: "#649cac",
        marginBottom: "30px",
    },
    form: {
        display: "grid",
        gap: "20px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontWeight: "bold",
        marginBottom: "5px",
        color: "#333",
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        fontSize: "15px",
    },
    readonlyInput: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        fontSize: "15px",
    },
    imageContainer: {
        textAlign: "center",
        marginBottom: "20px",
    },
    image: {
        width: "100px",
        height: "100px",
        borderRadius: "8px",
        objectFit: "cover",
        border: "1px solid #ccc",
    },
    fileInput: {
        marginTop: "10px",
    },
    removeBtn: {
        marginTop: "5px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "4px",
        cursor: "pointer",
    },
    buttonContainer: {
        textAlign: "center",
        marginTop: "30px",
    },
    button: {
        backgroundColor: "#649cac",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    imageGroup: {
        marginBottom: "25px",
    },

    imageRow: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginTop: "8px",
    },

    btnGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        alignItems: "flex-start",
    },
};

export default Profile;
