import { useState, useEffect } from "react";
import { fetchDoctorPatients, getAllAppointmentsByPatient } from "../../apiService";
const Patients = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const doctorId = localStorage.getItem("doctorId"); // Your actual doctor ID
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDoctorPatients(doctorId).then((data) => setPatients(data));
  }, []);
  const openPdfFromBase64 = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };


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
                onClick={async () => {
                  setSelectedPatient(patient);

                  const appts = await getAllAppointmentsByPatient(patient._id);
                  setAppointments(appts);
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
            <p><strong>Last Appointment:</strong> {new Date(selectedPatient.lastAppointment).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>

            <h3 className="apptHeading">Appointments</h3>
            <div className="appointmentsContainer">
              {appointments.length === 0 ? (
                <p>No appointments available</p>
              ) : (
                <ul className="appointmentsList">
                  {appointments.map((appt) => (
                    <li key={appt._id} className="appointmentItem">
                      <p><strong>Date:</strong> {new Date(appt.currentAppointmentDate).toLocaleDateString()}</p>
                      <p><strong>Notes:</strong> {appt.notes || "No notes"}</p>
                      {appt.isReportGenerated && appt.pdfReport?.file ? (
                        <button
                          onClick={() => openPdfFromBase64(appt.pdfReport.file)}
                          className="viewehrbtn"
                        >
                          View Report
                        </button>
                      ) : (
                        <p><em>No Report Available</em></p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
