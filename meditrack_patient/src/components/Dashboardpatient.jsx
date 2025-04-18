import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarPatient from './Navbarpatient';
import '../App.css';
import logo from '../assets/images/m_logo.jpeg';
import { fetchDoctors, bookAppointment, fetchPatient, fetchPatientAppointments } from '../apiService';
import { updatePatient } from '../apiService';
const Dashboard = () => {
  const location = useLocation();
  
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem('patientInfo');
        if (stored) {
          const localPatient = JSON.parse(stored);
          const freshPatient = await fetchPatient(localPatient._id);
          
          // Ensure doctor data is properly populated
          if (freshPatient.doctor && typeof freshPatient.doctor === 'string') {
            const doctorData = await fetchDoctor(freshPatient.doctor);
            freshPatient.doctor = doctorData; // Replace ID with full doctor object
          }
          
          localStorage.setItem('patientInfo', JSON.stringify(freshPatient));
          setPatientInfo(freshPatient);
        }
  
        const doctorData = await fetchDoctors();
        setDoctors(doctorData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, [location.pathname]);

  const updatePatientStatus = async (patientId, isNew) => {
    try {
      return await updatePatient(patientId, { isNew });
    } catch (error) {
      console.error("Error updating patient status:", error);
    }
  };



  const handleBook = async (doctor) => {
    const date = selectedDate[doctor.name];
    if (!date) {
      alert(`Please select a date for Dr. ${doctor.name}`);
      return;
    }
  
    try {
      const appointmentData = {
        patient: patientInfo._id,
        doctor: doctor._id,
        currentAppointmentDate: `${date}T10:00:00Z`
      };
      
      await bookAppointment(appointmentData);
      
      // Update patient's doctor if not already assigned
      if (!patientInfo.doctor) {
        await updatePatient(patientInfo._id, { doctor: doctor._id });
      }
      
      const updatedPatient = await fetchPatient(patientInfo._id);
      setPatientInfo(updatedPatient);
      
      setSelectedDate(prev => {
        const newDates = { ...prev };
        delete newDates[doctor.name];
        return newDates;
      });
      
      alert(`Appointment booked with Dr. ${doctor.name}`);
    } catch (err) {
      console.error("Booking error:", err.message);
      alert(`Booking failed: ${err.message}`);
    }
  };

  const updatePatientDoctor = async (patientId, doctorId) => {
    try {
      return await updatePatient(patientId, { doctor: doctorId });
    } catch (error) {
      console.error("Error updating patient doctor:", error);
      throw error;
    }
  };


  const getDoctorsToShow = () => {
    console.log("Patint Info : -",patientInfo.doctor)
  
    // If patient has a doctor assigned (regardless of active appointment)
    if (patientInfo.doctor) {
      // Find the assigned doctor in the doctors list
      return patientInfo.doctor ? [patientInfo.doctor] : [];
    }
  
  
    // No doctor assigned → show all doctors
    // const alldoctors = fetchDoctors();
    // return [alldoctors];
    return doctors;
  };



  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <NavbarPatient navbarColor="#649cac" logoUrl={logo} />
      <div className={`dashboard-content ${
  patientInfo?.activeAppointment || patientInfo?.doctor ? 'content-default' : 'content-centered'
}`}>

        <h1 className="left-aligned-heading">
          Hello, {patientInfo?.name || "Patient"}!
        </h1>
        {patientInfo?.activeAppointment ? (
          <div className="active-appointment-message">
            <h2 className='active-name'>You are Having an active appointment</h2>
            <h2 className='animated-box box-name'>Please check the Appointments Tab</h2>
          </div>
        ) : (
          <>
            <h2 className="appointment-heading">
              {(!patientInfo?.doctor )
                ? "Choose a Doctor"
                : "Book with Your Doctor"}
            </h2>
            <div className="appointment-tiles">
              {getDoctorsToShow().map((doc, idx) => (
                <div className="appointment-tile" key={idx}>
                  <h3>{doc.name}</h3>
                  <p>{doc.specialization}</p>
                  <input
                    type="date"
                    value={selectedDate[doc.name] || ''}
                    onChange={(e) => setSelectedDate({
                      ...selectedDate,
                      [doc.name]: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <button onClick={() => handleBook(doc)}>
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;