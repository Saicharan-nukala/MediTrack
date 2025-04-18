import { useState, useEffect } from "react";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import { fetchDoctorDetails} from "../../apiService";
import './PatientReportForm.css';
const PatientReportForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientData = queryParams.get("data");
  const [medications, setMedications] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const reportRef = useRef(null);
  const [formData, setFormData] = useState(() => {
    if (patientData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(patientData));
        return {
          patientName: parsedData.name || "",
          gender: parsedData.gender || "",
          age: parsedData.age || "",
          maritalStatus: parsedData.maritalStatus || "",
          children: parsedData.children || 0,
          condition: parsedData.condition || "",
          symptoms: parsedData.symptoms || [],
          firstAppointment: parsedData.firstAppointment || "",
          lastAppointment: parsedData.lastAppointment || "",
          nextAppointment: parsedData.nextAppointment || "",
          appointments: parsedData.appointments || [],
          ehrs: parsedData.ehrs || [],
          medicines: parsedData.medicines || [{ name: "", dosage: "" }],
          notes: parsedData.notes || "",
          customFields: parsedData.customFields || {}
        };
      } catch (error) {
        console.error("Error parsing patient data:", error);
      }
    }
    return {
      patientName: "",
      gender: "",
      age: "",
      maritalStatus: "",
      children: 0,
      condition: "",
      symptoms: [],
      firstAppointment: "",
      lastAppointment: "",
      nextAppointment: "",
      appointments: [],
      ehrs: [],
      medicines: [{ name: "", dosage: "" }],
      notes: "",
      customFields: {}
    };
  });

  console.log("Raw patientData from URL:", patientData.lastAppointment);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Add new medication
  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", qty: "", time: "" }]);
  };

  // Handle medication changes
  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedications = [...medications];
    updatedMedications[index][name] = value;
    setMedications(updatedMedications);
  };

  // Remove medication
  const removeMedication = (index) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  // 🔹 Add new symptom
  const addSymptom = () => {
    setSymptoms([...symptoms, { symptom: "", duration: "" }]);
  };

  // 🔹 Handle symptom changes
  const handleSymptomChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index][name] = value;
    setSymptoms(updatedSymptoms);
  };

  // 🔹 Remove symptom
  const removeSymptom = (index) => {
    const updatedSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(updatedSymptoms);
  };
  const [customFields, setCustomFields] = useState([]);

  const addCustomField = () => {
    setCustomFields([...customFields, { fieldName: "", fieldValue: "" }]);
  };

  const handleCustomFieldChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFields = [...customFields];
    updatedFields[index][name] = value;
    setCustomFields(updatedFields);
  };

  const removeCustomField = (index) => {
    const updatedFields = customFields.filter((_, i) => i !== index);
    setCustomFields(updatedFields);
  };
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem("doctorId");
  useEffect(() => {
    const getDoctorDetails = async () => {
      if (!doctorId) return; // Ensure doctorId is available
      const doctorData = await fetchDoctorDetails(doctorId);
      setDoctor(doctorData);
      setLoading(false);
    };
    getDoctorDetails();
  }, [doctorId]);

  if (loading) return <p>Loading doctor details...</p>;
  if (!doctor) return <p>Doctor not found.</p>;
  // Reference to the report container
  const generatePDF = async () => {
    if (!reportRef.current) {
      console.error("Error: Report reference is null!");
      return;
    }
  
    const reportElement = reportRef.current;
  
    try {
      // 🧠 Reduce scale from 2 ➜ 1.5 or 1 (smaller = less resolution = smaller file)
      const canvas = await html2canvas(reportElement, { scale: 1.2, useCORS: true });
  
      // 🔻 Convert canvas to lower-quality JPEG instead of PNG (much smaller size)
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality
  
      const pdf = new jsPDF("p", "mm", "a4");
  
      const imgWidth = 190;
      const pageHeight = 297;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      // 🧾 Add first page
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // 📦 Save it
      pdf.save(`Patient_Report_${formData.patientName || "Unknown"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };
  
  return (
    <>
      <div className="report-container" ref={reportRef}>
        <div className="form-section">
          <div className="report-header">
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization} | Reg. No: {doctorId}</p>
              <p><strong>Email :</strong> {doctor.email}</p>
            </div>
            <div className="clinic-logo">
              <img src="./images/logo.png" alt="Clinic Logo" />
            </div>
            <div className="clinic-info">
              <h3>Care Clinic</h3>
              <p>Near Axis Bank, Kothrud, Pune - 411038.</p>
              <p><strong>Ph:</strong> 094233 80390, <strong>Timing:</strong> 09:00 AM - 02:00 PM</p>
              <p><strong>Closed:</strong> Thursday</p>
            </div>
          </div>
        </div>
        <h2 className="report-title">Medical Report Form</h2>
        <div className="form-section">
          <div className="pnameage">
            <div>
              <label>Patient Name:</label>
              <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className="input-field" readOnly />
            </div>
            <div>
              <label>Age:</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" readOnly />
            </div>
            <div className="mydict">
              <label htmlFor="Gender">Gender:</label>
              <div>
                <label>
                  <input type="radio" name="radio" />
                  <span>Women</span>
                </label>
                <label>
                  <input type="radio" name="radio" />
                  <span>Men</span>
                </label>
                <label>
                  <input type="radio" name="radio" />
                  <span>Others</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mardiag">
            <label>Marital Status:</label>
            <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-field" readOnly />

            <label>Diagnosis / Condition:</label>
            <input type="text" name="condition" value={formData.condition} onChange={handleChange} className="input-field" readOnly />
          </div>

        </div>

        <div className="form-section">
          <div className="appo">
            <label>This Appointment:</label>
            <input type="date" name="lastAppointment" value={formData.lastAppointment} onChange={handleChange} className="input-field" />
            <label>Next Appointment:</label>
            <input type="date" name="nextAppointment" value={formData.nextAppointment} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div className="form-section">
          <h3>Symptoms</h3>
          <div className="sym-div-tab">
            <table className="sym-table">
              <thead>
                <tr>
                  <th>Symptom</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {symptoms.map((sym, index) => (
                  <tr key={index}>
                    <td><input type="text" name="symptom" value={sym.symptom} onChange={(e) => handleSymptomChange(index, e)} className="sym-input" /></td>
                    <td><input type="text" name="duration" value={sym.duration} onChange={(e) => handleSymptomChange(index, e)} className="sym-input" /></td>
                    <td><button className="remove-btn" onClick={() => removeSymptom(index)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="add-btn" onClick={addSymptom}>+ Add Symptom</button>
        </div>
        <div className="form-section">
          <h3>Medications</h3>
          <table className="medication-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Quantity</th>
                <th>When to Take</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <tr key={index}>
                  <td><input type="text" name="name" value={med.name} onChange={(e) => handleMedicationChange(index, e)} className="sym-input" /></td>
                  <td><input type="text" name="dosage" value={med.dosage} onChange={(e) => handleMedicationChange(index, e)} className="sym-input" /></td>
                  <td><input type="number" name="qty" value={med.qty} onChange={(e) => handleMedicationChange(index, e)} className="sym-input" /></td>
                  <td><input type="text" name="time" value={med.time} onChange={(e) => handleMedicationChange(index, e)} className="sym-input" /></td>
                  <td><button className="remove-btn" onClick={() => removeMedication(index)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-btn" onClick={addMedication}>+ Add Medication</button>
        </div>
        <div className="form-section">
          <h3>Additional Fields</h3>
          <div className="custom-fields-container">
            {customFields.map((field, index) => (
              <div key={index} className="custom-field">
                <input
                  type="text"
                  name="fieldName"
                  placeholder="Field Name"
                  value={field.fieldName}
                  onChange={(e) => handleCustomFieldChange(index, e)}
                  className="input-field"
                />
                <span>:</span>
                <input
                  type="text"
                  name="fieldValue"
                  placeholder="Value"
                  value={field.fieldValue}
                  onChange={(e) => handleCustomFieldChange(index, e)}
                  className="input-field"
                />
                <button onClick={() => removeCustomField(index)} className="remove-btn">X</button>
              </div>
            ))}
            <button onClick={addCustomField} className="add-btn">+ Add Field</button>
          </div>
        </div>

        <div className="form-section">
          <label>Doctor Notes:</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="text-area"></textarea>
        </div>

        <button className="report-btn" onClick={generatePDF}>Generate PDF</button>
      </div>
    </>
  );
};

export default PatientReportForm;