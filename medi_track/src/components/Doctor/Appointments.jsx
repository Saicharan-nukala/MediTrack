import { useState, useEffect } from "react";
import { getNewPatientsByDoctor } from "../../apiService";
import { getActiveAppointmentPatientsByDoctor } from "../../apiService";
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
  const doctorId = localStorage.getItem("doctorId"); // Your actual doctor ID
  const [patients, setPatients] = useState([]);

  const handleFilter = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    setFilteredAppointments(filterAppointmentsByDate(patients, start, end));
  };
  useEffect(() => {
    getActiveAppointmentPatientsByDoctor(doctorId).then((data) => setPatients(data));
  }, []);  
  const [newPatients, setNewPatients] = useState([]);
  useEffect(() => {
    const fetchNewPatients = async () => {
      try {
        const data = await getNewPatientsByDoctor(doctorId); // API call
        setNewPatients(data); // Set fetched new patients
      } catch (error) {
        console.error("Failed to fetch new patients:", error);
      }
    };

    fetchNewPatients();
  }, []);
  return (
    <>
      <div className="appointmentmain">
        <div className="appointmentlist">
          <div className="appointheading">
            <h2 className="dashheading">Appointments</h2>
            <label>Start Date:</label>
            <input type="date" className="dateinput" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

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
                      <p>{new Date(patient.firstAppointment).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' , day: '2-digit'})}</p>
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
