import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./Navbar";
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Records from "./Records";
import Appointments from "./Appointments";
import PatientReportForm from "./PatientReportForm";
import Profile from "./Profile";

const DoctorMain = () => {
  const doctorId = localStorage.getItem("doctorId");
  const location = useLocation();

  if (!doctorId) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const doctorNavItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Appointments", path: "/appointments" },
    { name: "Patients", path: "/patients" },
    { name: "Records", path: "/records" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="bodymain">
      <NavBar navItems={doctorNavItems} />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/records" element={<Records />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/report-form" element={<PatientReportForm />} />
      </Routes>
    </div>
  );
};

export default DoctorMain;
