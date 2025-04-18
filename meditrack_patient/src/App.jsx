import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboardpatient';
import PatientFirst from './components/patientfirst';
import NavBar from './components/Navbarpatient';
import Appointmentspatient from './components/Appointmentspatient';
import { ToastContainer } from 'react-toastify';
import PatientProfile from './components/profilepatients';


function App() {
  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<PatientFirst />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<NavBar />} />
        <Route path="/appointmentspatient" element={<Appointmentspatient />}/>
        <Route path="/profile" element={<PatientProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
