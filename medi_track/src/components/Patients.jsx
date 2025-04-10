import { useState, useEffect } from "react";
import { fetchDoctorPatients } from "../apiService";

const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedEHR, setSelectedEHR] = useState("");
  const doctorId = "67cd6bebf6637dfbd4d3b867"; // Your actual doctor ID
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchDoctorPatients(doctorId).then((data) => setPatients(data));
  }, []);

  return (
    <div className="maincontainer">
      {/* Patient List */}
      <div className="patientlist">
        <h2 className="dashheading">Patients</h2>
        {patients.length === 0 ? (
          <p className="nopatientmsgleft">No patients available</p>
        ) : (
          <ul>
            {patients.map((patient) => (
              <li
              key={patient.id}
              onClick={() => {
                setSelectedPatient(patient);
                setSelectedEHR(patient.ehrs.length > 0 ? patient.ehrs[0].url : "");
              }}
              className={`patient-item ${selectedPatient?.id === patient.id ? "selected-patient" : ""}`}
            >
              {patient.name}
            </li>
            
            ))}
          </ul>
        )}
      </div>

      <div className="detailsdivider"></div>

      {/* Patient Details */}
      <div className="patientdetails">
        {selectedPatient ? (
          <>
            <h2>Name: {selectedPatient.name}</h2>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Condition:</strong> {selectedPatient.condition}</p>
            <p><strong>Marital Status:</strong> {selectedPatient.maritalStatus}</p>
            <p><strong>Children:</strong> {selectedPatient.children}</p>
            <p><strong>Symptoms:</strong> {selectedPatient.symptoms.join(", ")}</p>
            <p><strong>Last Appointment:</strong> {new Date(selectedPatient.lastAppointment).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' , day: '2-digit'})}</p>

            {/* EHR Dropdown */}
            {selectedPatient.ehrs.length > 0 ? (
              <div className="selectehr">
                <label><strong>Select EHR:</strong></label>
                <div className="ehrbtns">
                  <select
                    className="ehrbtnsselect"
                    onChange={(e) => setSelectedEHR(e.target.value)}
                    value={selectedEHR}
                  >
                    {selectedPatient.ehrs.map((ehr) => (
                      <option key={ehr.id} value={ehr.url}>
                        {ehr.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="viewehrbtn"
                    onClick={() => window.open(selectedEHR, "_blank")}
                  >
                    View EHR
                  </button>
                </div>
              </div>
            ) : (
              <p><strong>No EHRs Available</strong></p>
            )}
          </>
        ) : (
          <div>
            <p className="nopatientmsgright">Please Select Patient</p>
            <img src="images/select_record.svg" alt="Select Record" className="selectrecordimg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
