import { useEffect, useState } from 'react';
import { fetchPatientAppointments, fetchPatient, fetchAppointmentById} from '../apiService';
import NavbarPatient from './Navbarpatient';
import '../App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Appointmentspatient = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [patientInfo, setPatientInfo] = useState(null);

  // Update the useEffect in Appointmentspatient.jsx
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get patient ID from localStorage
        const patientId = localStorage.getItem('patientId');
        if (!patientId) {
          console.error("No patientId found in localStorage");
          return;
        }

        // 2. Fetch fresh patient data (with populated appointments)
        const patientData = await fetchPatient(patientId);
        if (!patientData) {
          console.error("Failed to fetch patient data");
          return;
        }
        setPatientInfo(patientData);

        // 3. Process appointments
        const fullAppointments = await fetchPatientAppointments(patientId);
        
        // Process appointments to ensure consistent structure
        const processedAppointments = fullAppointments.map(appt => ({
          ...appt,
          _id: appt._id || appt.appointmentId, // Ensure we have _id
          date: appt.date || appt.currentAppointmentDate,
          report: appt.report || null,
          notes: appt.notes || null,
          pdfReport: appt.pdfReport || null,
          isReportGenerated: appt.isReportGenerated || false
        }));

        setAppointments(processedAppointments.filter(Boolean));

        // 4. Handle active appointment
        if (patientData.activeAppointment) {
          const fullAppointments = await fetchPatientAppointments(patientId);
          const activeAppt = fullAppointments.find(appt =>
            appt._id === patientData.activeAppointment._id ||
            appt._id === patientData.activeAppointment
          );
          setActiveAppointment(activeAppt);
        }

      } catch (error) {
        console.error("Appointment loading error:", error);
      }
    };

    loadData();
  }, []);

  const toggleExpand = (id, field) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field]
      }
    }));
  };

  // Helper function to format appointment date
  const formatAppointmentDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };
  const openPdfFromBase64 = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };
  const downloadPdfFromBase64 = (base64String, filename = "report.pdf") => {
    try {
      if (!base64String) {
        toast.error("No PDF data found.");
        return;
      }
  
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
  
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error("Error downloading PDF:", err);
      toast.error("Failed to download PDF report.");
    }
  };

  return (
    <>
      <NavbarPatient />
      <div className="patientappointments-container">
        <h1 className="appointments-title">
          {patientInfo?.name ? `${patientInfo.name}'s Appointments` : 'All Appointments!'}
        </h1>

        <div className="appointments-main">
          {/* Left: All Appointments from patient's appointments field */}
          <div className="appointments-list">
            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id || appt.appointmentId} className="appointment-card">
                  <p><strong>Doctor:</strong> {patientInfo.doctor?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {formatAppointmentDate(appt.date || appt.currentAppointmentDate)}</p>

                  <div className="action-buttons">
                  {appt.isReportGenerated && appt.pdfReport?.file ? (
                        <button
                          onClick={() => openPdfFromBase64(appt.pdfReport.file)}
                          className="view-btn"
                        >
                          View Report
                        </button>
                      ) : (
                        <p><em>No Report Available</em></p>
                      )}
                    <button 
                      className="view-btn"
                      onClick={() => toggleExpand(appt._id, 'notes')}
                    >
                      {expandedItems[appt._id]?.notes ? 'Hide Notes' : 'View Notes'}
                    </button>
                    {appt.isReportGenerated && appt.pdfReport?.file ? (
                        <button
                          onClick={() => downloadPdfFromBase64(appt.pdfReport.file)}
                          className="view-btn"
                        >
                          Download Report
                        </button>
                      ) : (
                        <p><em>No Report Available</em></p>
                      )}
                  </div>
                  {expandedItems[appt._id || appt.appointmentId]?.report && (
                    <div className="expanded-content">
                      <strong>Report:</strong> {appt.report || 'Null'}
                    </div>
                  )}
                  {expandedItems[appt._id || appt.appointmentId]?.notes && (
                    <div className="expanded-content">
                      <strong>Notes:</strong> {appt.notes || 'Null'}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right: Active Appointment from patient's activeAppointment field */}
          <div className="active-appointment-section">
            {activeAppointment ? (
              <div className="active-appointment-card">
                <h2>Active Appointment</h2>
                <p><strong>Doctor:</strong> Dr. {activeAppointment.doctor?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {formatAppointmentDate(activeAppointment.date || activeAppointment.currentAppointmentDate)}</p>
                <p><strong>Status:</strong> Processing...</p>
                {activeAppointment.notes && (
                  <p><strong>Notes:</strong> {activeAppointment.notes}</p>
                )}
              </div>
            ) : (
              <div className="active-appointment-card">
                <h2>Active Appointment</h2>
                <p>No active appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointmentspatient;