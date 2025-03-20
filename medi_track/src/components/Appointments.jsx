import { useState,useEffect } from "react";
import { fetchDoctorPatients } from "../apiService";
const filterAppointmentsByDate = (patients, startDate, endDate) => {
  return patients.filter((patient) => {
    const lastAppointment = patient.lastAppointment ? new Date(patient.lastAppointment) : null;
    const nextAppointment = patient.nextAppointment ? new Date(patient.nextAppointment) : null;
    const firstAppointment = patient.firstAppointment ? new Date(patient.firstAppointment) : null;

    return (
      (lastAppointment && lastAppointment >= startDate && lastAppointment <= endDate) ||
      (nextAppointment && nextAppointment >= startDate && nextAppointment <= endDate) ||
      (firstAppointment && firstAppointment >= startDate && firstAppointment <= endDate)
    );
  });
};
const Appointments = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const doctorId = "67cd6bebf6637dfbd4d3b867"; // Your actual doctor ID
  const [patients, setPatients] = useState([]);

  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    setFilteredAppointments(filterAppointmentsByDate(patients, start, end));
  };

  useEffect(() => {
      fetchDoctorPatients(doctorId).then((data) => setPatients(data));
        }, []);
    const newPatients = [
          {
            id: 3,
            name: "Alice Brown",
            age: 40,
            gender: "Female",
            condition: "Asthma",
            maritalStatus: "Married",
            children: 1,
            symptoms: ["Shortness of Breath", "Cough"],
            firstAppointment: "2024-12-15",
            ehrs: [],
          },
          {
            id: 4,
            name: "Michael Green",
            age: 28,
            gender: "Male",
            condition: "Allergy",
            maritalStatus: "Single",
            children: 0,
            symptoms: ["Sneezing", "Skin Rash"],
            firstAppointment: "2024-12-15",
            ehrs: [],
          },
          {
            id: 5,
            name: "Sophia Williams",
            age: 35,
            gender: "Female",
            condition: "Migraine",
            maritalStatus: "Married",
            children: 2,
            symptoms: ["Severe Headache", "Nausea"],
            firstAppointment: "2024-12-16",
            ehrs: [],
          },
          {
            id: 6,
            name: "David Johnson",
            age: 50,
            gender: "Male",
            condition: "Arthritis",
            maritalStatus: "Married",
            children: 3,
            symptoms: ["Joint Pain", "Swelling"],
            firstAppointment: "2024-12-17",
            ehrs: [],
          },
        ];
    
  
    return (
      <>
      <div className="appointmentmain">
          <div className="appointmentlist">
          <div className="appointheading">
          <h2 className="dashheading">Appointments</h2>
            <label>Start Date:</label>
            <input type="date"  className="dateinput" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            
            <label>End Date:</label>
            <input type="date" className="dateinput" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            
            <button onClick={handleFilter} className="filterbtnappo">Apply</button>
          </div>
          {filteredAppointments.length === 0 ? (
              <p className="nopatientmsgright">No appointments available in this range</p>
            ) : (
              <div className="appolisttable">
              <div className="appolistheadrow">
                <div className="appolisthead">Patient Name</div>
                <div className="appolisthead">Condition</div>
                <div className="appolisthead">Last Appointment</div>
                <div className="appolisthead">Next Appointment</div>
              </div> 
              <ul>
                {filteredAppointments.map((patient) => (
                  <li key={patient.id} className="patient-item">
                    <div className="list-item-struct">
                        <p>{patient.name}</p>
                        <p>{patient.condition}</p>
                        <p>{new Date(patient.lastAppointment).toLocaleDateString()}
                        </p>
                        <p>{new Date(patient.nextAppointment).toLocaleDateString()}
                        </p>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            )}
          </div>
          <div className="newpatientappo">
          <h2 className="dashheading">New Patient Appointments</h2>
          {newPatients.length === 0 ? (
              <p className="nopatientmsgright">No new Appointmenst</p>
            ) : (
              <div className="appolisttable">
              <div className="appolistheadrow">
                <div className="appolisthead">Patient Name</div>
                <div className="appolisthead">Condition</div>
                <div className="appolisthead">First Appointment</div>
                
              </div> 
              <ul>
                {newPatients.map((patient) => (
                  <li key={patient.id} className="patient-item">
                    <div className="list-item-struct">
                        <p>{patient.name}</p>
                        <p>{patient.condition}</p>
                        <p>{patient.firstAppointment}</p>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            )}
          </div>
      </div>
      </>
    );
  };
  
  export default Appointments;
  