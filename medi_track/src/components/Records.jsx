import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorPatients } from "../apiService";
const Records = () => {
  const navigate = useNavigate();
  const doctorId = "67cd6bebf6637dfbd4d3b867"; // Your actual doctor ID
  const [patients, setPatients] = useState([]);
 
  useEffect(() => {
    fetchDoctorPatients(doctorId).then((data) => setPatients(data));
  }, []);
  const handleRedirect = (patient) => {
    const patientData = encodeURIComponent(JSON.stringify(patient));
    navigate(`/report-form?data=${patientData}`);
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
                  {patients.map((patient,index) => (
                    <li
                    key={patient.id || `patient-${index}`} // Ensure unique key
                    onClick={() => handleRedirect(patient)}
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
          <div className="recordrightcontainer" >
            <div className="">
              <h2>Something</h2>
              <p>Coming Soon...</p>
              <p>For Report Generation click on the patient name</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default Records;
