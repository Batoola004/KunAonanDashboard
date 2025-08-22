import './login.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null); // لإظهار رسائل المعلومات
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const response = await api.post("/admin/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/home");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "فشل تسجيل الدخول");
      } else {
        setError("حدث خطأ، حاول لاحقاً.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("الرجاء إدخال بريدك الإلكتروني أولاً");
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      await api.post("/admin/forgotPassword", { email });
      setInfo("تم إرسال كود التحقق إلى بريدك الإلكتروني");
      setTimeout(() => navigate("/forgot-password"), 1500); // تحويل بعد 1.5 ثانية
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "فشل في إرسال البريد");
      } else {
        setError("حدث خطأ، الرجاء المحاولة لاحقاً.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-box'>
        <div className="form-side">
          <div className="input-group">
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <a
              href="#"
              className="forgot"
              onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}
            >
              forget password?
            </a>

            {error && <p className="error-message">{error}</p>}
            {info && <p className="info-message">{info}</p>}

            <button
              className={`login-btn ${loading ? "loading" : ""}`}
              onClick={(e) => { handleRipple(e); handleLogin(); }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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

export default App;
