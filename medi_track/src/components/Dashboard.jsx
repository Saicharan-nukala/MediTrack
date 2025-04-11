import { useEffect, useState } from "react";
import { fetchDoctorPatients } from "../apiService";
import { fetchDoctorDetails } from "../apiService";
import { getNewPatientsByDoctor } from "../apiService";
const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const doctorId = localStorage.getItem("doctorId"); // Your actual doctor ID
  const [doctor, setDoctor] = useState(null); // Replace with actual doctor ID
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
  const todaysPatients = patients.filter(
    (patient) => patient.nextAppointment === today
  );
  const getTotalAppointmentsThisWeek = (patients) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return patients.filter(patient => {
      const appointmentDate = new Date(patient.nextAppointment);
      return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
    }).length;
  };

  const getRecordstouploadthisWeek = (patients) => {
    const today = new Date();
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

    return patients.filter(patient => {
      const appointmentDate = new Date(patient.nextAppointment);
      return appointmentDate >= startOfLastWeek && appointmentDate <= endOfLastWeek;
    }).length;
  };

  const getPatientsofRectoUploadThisWeek = (patients) => {
    const today = new Date();
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

    return patients.filter(patient => {
      const appointmentDate = new Date(patient.nextAppointment);
      return appointmentDate >= startOfLastWeek && appointmentDate <= endOfLastWeek;
    });
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
              <p> Total Appointments (This Week): {getTotalAppointmentsThisWeek(patients)}</p>
            </div>
            <div className="in-grid-item">
              <p> Total Records to upload (This Week): {getRecordstouploadthisWeek(patients)}</p>
            </div>
          </div>
          <div className="grid-item">
            <div className="todaypatientlistdash">
              <h3 className="dashheading">Today Appointments</h3>
              {todaysPatients.length === 0 ? (
                <p className="nopatientmsgleft">No patients available</p>
              ) : (
                <ul>
                  {todaysPatients.map((patient) => (
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
          <div className="grid-item">
            <div className="todaypatientlistdash">
              <h3 className="dashheading">Patients list of records to upload this week</h3>
              {getPatientsofRectoUploadThisWeek(patients).length === 0 ? (
                <p className="nopatientmsgleft">No Records To Upload This Week</p>
              ) : (
                <ul>
                  {getPatientsofRectoUploadThisWeek(patients).map((patient) => (
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
