import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

const NavBar = ({ navItems }) => {
  const location = useLocation(); // Get current path

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="logonav" src="images/logo.png" alt="Logo" />
      </div>
      <div className="nav-links">
        <ul className="navlist">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <Link to={item.path} className="nav-link">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NavBar;
