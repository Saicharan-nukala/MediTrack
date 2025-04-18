import React, { useState, useRef } from 'react';
import '../App.css';
import logo from '../assets/images/m_logo.jpeg';
import bgImage from '../assets/images/mentor-details-back.jpg';
import { registerPatient, loginPatient } from '../apiService';
import { useNavigate } from 'react-router-dom';
 // Adjust path as needed

 
 const PatientFirst = () => {
    const navigate = useNavigate();
    const [showNewForm, setShowNewForm] = useState(false);
    const [showOldForm, setShowOldForm] = useState(false);
    const newHoverRef = useRef(null);
    const oldHoverRef = useRef(null);

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [condition, setCondition] = useState('');
    const [mailid, setMailid] = useState('');
    const [password, setPassword] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [children, setChildren] = useState('');
    const [symptoms, setSymptoms] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleMouseEnterNew = () => {
        clearTimeout(newHoverRef.current);
        setShowNewForm(true);
    };

    const handleMouseLeaveNew = () => {
        newHoverRef.current = setTimeout(() => setShowNewForm(false), 1000);
    };

    const handleMouseEnterOld = () => {
        clearTimeout(oldHoverRef.current);
        setShowOldForm(true);
    };

    const handleMouseLeaveOld = () => {
        oldHoverRef.current = setTimeout(() => setShowOldForm(false), 1000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsRegistering(true);

        const newPatient = {
            name,
            gender,
            age: age ? Number(age) : 0,
            condition,
            mailid,
            password,
            maritalStatus,
            children: children ? Number(children) : 0,
            symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
        };

        try {
            await registerPatient(newPatient);
            alert('Patient registered successfully!');
            setShowNewForm(false);
            setName('');
            setGender('');
            setAge('');
            setCondition('');
            setMailid('');
            setPassword('');
            setMaritalStatus('');
            setChildren('');
            setSymptoms('');
        } catch (error) {
            alert(error.message);
        } finally {
            setIsRegistering(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
      
        try {
          const response = await loginPatient({ mailid: loginEmail, password: loginPassword });
      
          // Save token securely (localStorage or cookies)
          localStorage.setItem('patientToken', response.token);
          localStorage.setItem('patientInfo', JSON.stringify(response.patient));
      
          navigate('/dashboard');
        } catch (error) {
          console.error('Login error:', error);
          alert('Failed to login, please try again.');
        } finally {
          setIsLoggingIn(false);
        }
      };
      
    

    return (
        <div className='p_1'>
            <img src={logo} alt="logo" className='m_logo' />
            <div className='vertical-line'></div>
            <div className='center-buttons'>
                <button className='btn' onMouseEnter={handleMouseEnterNew} onMouseLeave={handleMouseLeaveNew}>
                    New Patient
                </button>
                {showNewForm && (
                    <div className='hover-bridge' onMouseEnter={handleMouseEnterNew} onMouseLeave={handleMouseLeaveNew} />
                )}
                <button className='btn' onMouseEnter={handleMouseEnterOld} onMouseLeave={handleMouseLeaveOld}>
                    Old Patient
                </button>
                {showOldForm && (
                    <div className='hover-bridge left-hover' onMouseEnter={handleMouseEnterOld} onMouseLeave={handleMouseLeaveOld} />
                )}
                <img src={bgImage} alt="background" className='background-image' />
            </div>

            {showNewForm && (
                <div className='form-container' onMouseEnter={handleMouseEnterNew} onMouseLeave={handleMouseLeaveNew}>
                    <div className="container">
                        <div className="title">New Patient Details</div>
                        <div className="content">
                            <form onSubmit={handleRegister}>
                                <div className="user-details">
                                    <div className="input-box"><span className="details">Full Name</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Gender</span><input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Age</span><input type="number" value={age} onChange={(e) => setAge(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Condition</span><input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Email</span><input type="email" value={mailid} onChange={(e) => setMailid(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Marital Status</span><input type="text" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">No of Children</span><input type="number" value={children} onChange={(e) => setChildren(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Symptoms</span><input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required /></div>
                                </div>
                                <div className="button">
                                    <input type="submit" value={isRegistering ? 'Registering...' : 'Register'} disabled={isRegistering} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showOldForm && (
                <div className='form-container old-patient-form' onMouseEnter={handleMouseEnterOld} onMouseLeave={handleMouseLeaveOld}>
                    <div className="old-patient-container">
                        <div className="title">Old Patient Login</div>
                        <div className="content">
                            <form onSubmit={handleLogin}>
                                <div className="user-details">
                                    <div className="input-box"><span className="details">Email</span><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required /></div>
                                    <div className="input-box"><span className="details">Password</span><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /></div>
                                </div>
                                <div className="button">
                                    <input type="submit" value={isLoggingIn ? 'Logging in...' : 'Login'} disabled={isLoggingIn} />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientFirst;
