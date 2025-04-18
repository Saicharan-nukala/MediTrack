import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DoctorMain from './components/Doctor/DoctorMain';
import Footer from './components/Doctor/Footer';
import Login from './components/Doctor/Login';

function App() {
  const doctorToken = localStorage.getItem("doctorToken");

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={doctorToken ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<DoctorMain />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
