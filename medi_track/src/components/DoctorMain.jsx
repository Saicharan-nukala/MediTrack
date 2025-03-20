import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Navbar";
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Records from "./Records";
import Appointments from "./Appointments";
import PatientReportForm from "./PatientReportForm";

const DoctorMain = () => {
  const doctorNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Appointments", path: "/appointments" },
    { name: "Patients", path: "/patients" },
    { name: "Records", path: "/records" },
  ];
  return (
    <Router>
      <div className="bodymain">
        <NavBar navItems={doctorNavItems} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard  />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/records" element={<Records />} />
          <Route path="/report-form" element={<PatientReportForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default DoctorMain;




