# 🩺 MediTrack – Electronic Health Record & Appointment Management System

MediTrack is a full-stack healthcare management system built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It enables patients to book appointments and view their medical reports, while doctors can manage patient records and generate PDF reports. The application features role-based dashboards, responsive design, and secure authentication.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)

---

## 📖 About the Project

MediTrack aims to streamline doctor-patient interactions by providing a centralized platform for:
- Appointment booking
- Electronic Health Record (EHR) viewing
- Medical report generation and storage

The app uses **JWT-based authentication**, supports **PDF generation using `jspdf` and `html2canvas`**, and stores reports as **Base64-encoded strings** in MongoDB.

---

## 🚀 Features

### 👨‍⚕️ Doctor
- View assigned patients.
- Access Electronic Health Records (EHRs).
- Generate and upload PDF reports using `jspdf` + `html2canvas`.
- Reports are stored as Base64 and linked to appointments.

### 👩‍🦰 Patient
- Secure registration and login.
- Book appointments with doctors.
- View previous appointments and uploaded medical reports.

> 🔐 JWT-based authentication for secure access.

---

## 🛠️ Tech Stack

| Technology | Description         |
|------------|---------------------|
| Frontend   | React.js            |
| Backend    | Node.js, Express.js |
| Database   | MongoDB             |
| PDF Tools  | `jspdf`, `html2canvas` |
| Auth       | JSON Web Tokens (JWT) |
| Styling    | Manual CSS |

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Saicharan-nukala/MediTrack.git
cd MediTrack


MediTrack/
├── medi-track/                  # React frontend code
├── meditrack_patients/          # Frontend code for patient-specific features
├── meditrack_backend_total/     # Backend code (Node.js, Express, MongoDB)
└── README.md                    # Project description

Contributors
Sai Charan Nukala – Student
Ambatipally Sree Charan - Student
