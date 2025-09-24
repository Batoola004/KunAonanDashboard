import React, { useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import api from '../../api/axios';

function Login2() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
      setError(null);
    }
  };

  const handleSend = async () => {
    if (code.length !== 6) {
      setError("يجب إدخال 6 أرقام");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem("resetEmail"); 
      if (!email) {
        setError("الإيميل غير موجود. رجاء أعد العملية من جديد.");
        return;
      }

      const res = await api.post("/admin/checkCode", { 
        email, 
        code 
      });

      if (res.data.message === "code_is_valid") {
        localStorage.setItem("resetCode", code); 
        navigate('/Login3'); 
      } else {
        setError(res.data.message || "الكود غير صحيح");
      }
    } catch (err) {
      setError(err.response?.data?.message || "فشل التحقق من الكود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className="form-side">
          <div className="input-group">
            <Typography variant="subtitle1"></Typography>
            <div>
              <label htmlFor='vercode'>
                Enter the verification code that was sent to your email:<br />(6-Digits)
              </label>
              <input
                id='vercode'
                type="text"
                value={code}
                onChange={handleChange}
                maxLength="6"
                placeholder="Enter verification code"
                required
              />
              {error && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {error}
                </p>
              )}
            </div>
            <button 
              className='login-btn' 
              onClick={handleSend} 
              disabled={loading}
            >
              {loading ? "Checking..." : "Send"}
            </button>
          </div>
        </div>
        <div className="logo-side">
          <img src="/assets/Kun_aonan.jpg" alt="logo" className="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Login2;
