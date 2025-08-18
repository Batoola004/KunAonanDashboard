import React from 'react';
import './login.scss'
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useState } from "react";


function Login2() {
    const navigate = useNavigate();
    const handleSend = () => {
        navigate('/Login3');
    };

    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value)) {
            setCode(value);
            setError(value.length !== 6);
        }
    };
    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className="form-side">
                    <div className="input-group">
                        <Typography className="" variant="subtitle1"></Typography>
                        <div>
                            <label htmlFor='vercode'>Enter the verification code that was sent to your email:<br />(6-Digits)</label>
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
                                <p style={{ color: "#42A5F5	", marginTop: "5px" }}>
                                    only 6 numbers please
                                </p>
                            )}

                        </div>
                        <button className='login-btn' onClick={handleSend}>Send</button>

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
