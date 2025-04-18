import { useEffect, useState } from "react";
import { fetchDoctorPatients } from "../../apiService";
import { fetchDoctorDetails } from "../../apiService";
import { getNewPatientsByDoctor,getActiveAppointmentsByDoctor,getPendingReportAppointmentsByDoctor} from "../../apiService";
const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const doctorId = localStorage.getItem("doctorId"); // Your actual doctor ID
  const [doctor, setDoctor] = useState(null); // Replace with actual doctor ID
  const [activeAppointmnets,setactiveAppointmnets] = useState([]);
  const [pendingReportAppointments,setpendingReportAppointments] = useState([]);
  console.log("Pending Reports : - ", getPendingReportAppointmentsByDoctor(doctorId));

  useEffect(() => {
    const getDoctorDetails = async () => {
      const data = await fetchDoctorDetails(doctorId);
      if (data) {
        setDoctor(data);
      }
    };
    getDoctorDetails();
  }, []);
  useEffect(() => {
    fetchDoctorPatients(doctorId).then((data) => setPatients(data));
  }, []);
  useEffect(() => {
    getActiveAppointmentsByDoctor(doctorId).then((data) => setactiveAppointmnets(data));
  }, []);
  useEffect(() => {
    getPendingReportAppointmentsByDoctor(doctorId).then((data) => setpendingReportAppointments(data));
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
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointmnets = activeAppointmnets.filter(
    (appointment) => appointment.
    currentAppointmentDate.toISOString().split("T")[0] === today
  );
  console.log("Today Appoinments : -",todaysAppointmnets);
  const getTotalAppointmentsThisWeek = (appointments) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.currentAppointmentDate);
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    }).length;
  };

  const getRecordstouploadthisWeek = (appointments) => {
    return appointments.length;
  };
  const getRecordstouploadthisWeekPatinets = (appointments) => {

    return appointments;
  };


  return (
    <>
      <div className="dashmain">
        <div className="namehead">
          <h1 className="colorhead">Hai</h1>
          <h1 className="normalhead">{doctor?.name || "Unknown Doctor"}</h1>

        </div>
        <div className="divgrid">
          <div className="grid-item">
            <div className="in-grid-item i1">
              <p>Total Patients : {patients.length}</p>
            </div>
            <div className="in-grid-item i2">
              <p> Total Appointments (This Week): {getTotalAppointmentsThisWeek(activeAppointmnets)}</p>
            </div>
            <div className="in-grid-item">
              <p> Total Records to upload : {getRecordstouploadthisWeek(pendingReportAppointments)}</p>
            </div>
          </div>
          <div className="grid-item">
            <div className="todaypatientlistdash">
              <h3 className="dashheading">Today Appointments</h3>
              {todaysAppointmnets.length === 0 ? (
                <p className="nopatientmsgleft">No patients available</p>
              ) : (
                <ul>
                  {todaysAppointmnets.map((appointment) => (
                    <li
                      key={appointment._id}
                      className={`today-patient-item`}
                    >
                      {appointment.patientName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid-item">
            <div className="todaypatientlistdash">
              <h3 className="dashheading">Report Upload Pending Patinets</h3>
              {getRecordstouploadthisWeekPatinets(pendingReportAppointments).length === 0 ? (
                <p className="nopatientmsgleft">No Records To Upload This Week</p>
              ) : (
                <ul>
                  {getRecordstouploadthisWeekPatinets(pendingReportAppointments).map((activeAppointmnet) => (
                    <li
                      key={activeAppointmnet._id}
                      className={`today-patient-item`}
                    >
                      {activeAppointmnet.patientName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="grid-item">
            <div className="newpatientslist">
              <h3 className="dashheading">New Patients</h3>
              {newPatients.length === 0 ? (
                <p className="nopatientmsgleft">No New Patients</p>
              ) : (
                <ul>
                  {newPatients.map((patient) => (
                    <li
                    key={patient.id}
                      className={`today-patient-item`}
                    >
                      {patient.name}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
