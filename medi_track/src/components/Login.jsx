
const Login = () =>
{
   return (
            <>
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
                    <label htmlFor="Email">Email</label>
                    <input type="text" placeholder='example@gmail.com'/>
                </div>
                <div>
                    <label htmlFor="Password">Password</label>
                    <input type="text" placeholder='example123'/>
                </div>
                <div>
                <label htmlFor="User">User</label>
                <select name="" id="user">
                    <option> --- Select User ---- </option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="adimin">Admin</option>
                </select>
                </div>
                </div>
                <div>
                <button className='loginbtn'><b>Login</b></button>
                </div>
            </div>
            </div>
            
    </>
   );
};

export default Login;
