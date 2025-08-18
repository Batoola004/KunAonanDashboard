import React from 'react';
import './login.scss'
import { useNavigate } from 'react-router-dom';



function Login3() {
   const navigate = useNavigate();
      const handleSend = () => {
          navigate('/confirm');
      };
  return (

    <div className='login-container'>
      <div className='login-box'>
        <div className="form-side">
          <div className="input-group">
            <div>
              <label htmlFor='password1'>New password:</label>
              <input type="password" id="password1" placeholder="Enter the new Password" />
            </div>
            <div>
              <label htmlFor='password2'>Confirm new password:</label>
              <input type="password" id="password2" placeholder="Confirm your new Password" />
            </div>
            <button className='login-btn' onClick={handleSend}>Confirm</button>
          </div>
        </div>
        <div className="logo-side">
          <img src="/assets/Kun_aonan.jpg" alt="logo" className="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login3;
