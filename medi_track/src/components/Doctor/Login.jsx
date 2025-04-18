import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SimpleNavBar from "./SimpleNavBar";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (userType === "doctor") {
      try {
        const res = await axios.post("http://localhost:5000/api/doctors/login", {
          email,
          password,
        });

        // Store doctor data
        localStorage.setItem("doctorToken", res.data.token);
        localStorage.setItem("doctorId", res.data.doctorId);

        // Navigate to dashboard
        navigate("/dashboard");
      } catch (err) {
        alert("Login failed. Invalid credentials.",err);
      }
    } else {
      alert("Select Doctor login or handle other roles.");
    }
  };

  return (
    <>
      <SimpleNavBar />
      <div className='homemain'>
        <div className='leftmain'>
          <img src="images/login_side_img.svg" alt="" />
        </div>
        <div className="maindiv"></div>
        <div className='rightmain'>
          <div className='heading'>
            <div className='loginhead'><h1 >Login In</h1></div>
            <div className="divider"></div>
          </div>
          <div className='details'>
            <div className='emaildet'>
              <label>Email</label>
              <input type="text" placeholder='example@gmail.com' value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Password</label>
              <input type="password" placeholder='example123' value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label>User</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                <option> --- Select User ---- </option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <button className='loginbtn' onClick={handleLogin}><b>Login</b></button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
