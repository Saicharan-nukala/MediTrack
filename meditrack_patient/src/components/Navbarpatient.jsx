import '../App.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/m_logo.jpeg';
import { logoutPatient } from '../apiService';

const NavbarPatient = ({ navbarColor, logoUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutPatient();
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar" >
      <div className="logo-container">
        <img className="m_logo" src={logoUrl || logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <ul className="navlist">
          <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/appointmentspatient' ? 'active' : ''}`}>
            <Link to="/appointmentspatient" className="nav-link">Appointments</Link>
          </li>
          <li className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
          {/* <li className="nav-item">
            <span onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
              Logout
            </span>
          </li> */}
        </ul>
      </div>
    </nav>
  );
};

NavbarPatient.propTypes = {
  navbarColor: PropTypes.string,
  logoUrl: PropTypes.string,
};

export default NavbarPatient;
