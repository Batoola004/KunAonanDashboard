import React, { useState } from 'react';
import './login.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Login3() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code"); // ?code=...

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError("الرجاء إدخال كلمة المرور الجديدة");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return;
    }

    if (!code) {
      setError("رمز إعادة التعيين مفقود");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/admin/resetPassword', null, {
        params: {
          code: code,
          password: password,
          password_confirmation: confirmPassword
        }
      });

      if (response.data?.message) {
        setSuccess(response.data.message);
        setPassword("");
        setConfirmPassword("");
        // توجيه بعد ثانيتين
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "حدث خطأ داخلي، حاول لاحقًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className="form-side">
          <div className="input-group">
            <label htmlFor='password1'>كلمة المرور الجديدة:</label>
            <input 
              type="password" 
              id="password1" 
              placeholder="أدخل كلمة المرور الجديدة" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor='password2'>تأكيد كلمة المرور:</label>
            <input 
              type="password" 
              id="password2" 
              placeholder="أكد كلمة المرور الجديدة" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: "5px" }}>{success}</p>}

            <button 
              className='login-btn' 
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "تأكيد"}
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

export default Login3;
