import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorPatients } from "../apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Records = () => {
  const navigate = useNavigate();
  const doctorId = "67cd6bebf6637dfbd4d3b867"; // Your actual doctor ID
  const [patients, setPatients] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null); // Track selected patient

  useEffect(() => {
    fetchDoctorPatients(doctorId).then((data) => setPatients(data));
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  
  const handleGenerateReport = () => {
    if (selectedPatient) {
      const patientData = encodeURIComponent(JSON.stringify(selectedPatient));
      navigate(`/report-form?data=${patientData}`);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      toast.error("Please upload only one valid PDF file.");
      event.target.value = "";
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      toast.success(`PDF "${selectedFile.name}" uploaded successfully!`);
      // Upload logic here
      setSelectedFile(null); // Reset after upload
    } else {
      toast.warn("No file selected!");
    }
  };


  return (
    <>
      <div>
        <div className="reportcontainer">
          <div className="recordleftpatients">
            <div className="patientlist">
              <h2 className="dashheading">Patients</h2>
              {patients.length === 0 ? (
                <p className="nopatientmsgleft">No patients available</p>
              ) : (
                <ul>
                  {patients.map((patient, index) => (
                    <li
                      key={patient.id || `patient-${index}`}
                      onClick={() => handlePatientClick(patient)}
                      className="patient-item"
                    >
                      {patient.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="recorddivider"></div>

          <div className="recordrightcontainer">
            {selectedPatient ? (
              <div className="patient-details">
                <h2>Name: {selectedPatient.name}</h2>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Age:</strong> {selectedPatient.age}</p>
                <p><strong>Condition:</strong> {selectedPatient.condition}</p>
                <p><strong>Marital Status:</strong> {selectedPatient.maritalStatus}</p>
                <p><strong>Children:</strong> {selectedPatient.children}</p>
                <p><strong>Symptoms:</strong> {selectedPatient.symptoms.join(", ")}</p>
                <p><strong>Last Appointment:</strong> {new Date(selectedPatient.lastAppointment).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' , day: '2-digit'})}</p>
                <div style={{ marginTop: "20px" }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                  <button onClick={handleUpload} 
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#649cac",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginLeft: "10px",
                  }}>
                    Upload Report
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#649cac",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginLeft: "10px",
                    }}
                  >
                    Generate Report
                  </button>
                </div>

              </div>
            ) : (
              <div>
                <p className="nopatientmsgright">Please Select Patient</p>
                <img src="images/select_record.svg" alt="Select Record" className="selectrecordimg" />
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default Records;
