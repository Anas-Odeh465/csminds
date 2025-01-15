import React, { useState } from "react";
import "./forogtpass.css";
import { validation_login } from "./login-validation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./reset-password";
import "./forogtpass.css";

const EmailVerification = () => {
    const [code, setCode] = useState(["", "", "", ""]);
    const [email, setEmail] = useState("");
    const [error, setError] = useState({});
  
    const navigate = useNavigate();
  
    const handleInputChange = (index, value) => {
      if (/^[0-9]?$/.test(value)) {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
  
        if (value && index < 3) {
          document.getElementById(`input-${index + 1}`).focus();
        }
      }
    };
  
    const handelchangeValue = (event) =>{
      setEmail(prev => ({...prev, [event.target.name]: event.target.value}))
    }
  
    const handleSendEmail = () => {
      const err = validation_login(email);
      setError(err);
      if (err.email === "") {
          axios.post('http://localhost:3307/forgot-password', email)
          .then(res => {
              if (res.data === "Invalid email or password") {
                  alert(res.data); 
              } else {
                  alert(res.data);
              }
          })
          .catch(err => console.error(err));
      } 
    };
  
    const enteredCode = code.join('');
    const handleVerify = () => {
  
      if (enteredCode.length < 4) {
        alert('Please enter all 4 digits.');
      } else {
        axios.post('http://localhost:3307/checkCode', { code: enteredCode, email })
        .then(res => {
          if (res.data === "Verification successful") {
              alert(res.data); 
              navigate('/resetpass', { state: { email } });
          } else {
              alert(res.data);
          }
      })
      .catch(err => console.error(err));
      }
    };
  
  
    return (
        <div className="verification-container">
            <div className="verification-header">
                <h1 className="text-2xl font-extrabold text-white drop-shadow-md">CS Minds</h1>
                <h2 className="text-lg font-semibold text-white mt-2">Forgot Password</h2>
                <p className="text-sm font-semibold text-white mt-2">The code expire after 3 minutes</p>
            </div>
            
            <p className="verification-description">
                Enter your email, then click "Send Code" Enter the 4-digit code sent to your email, then click "Verify."
            </p>
            
            <input
                type="email"
                placeholder="Enter your CS Minds email"
                name="email"
                onChange={handelchangeValue}
                className="email-input"
            />
            {error.email && <span className="text-danger">{error.email}</span>}
            
            <div className="verification-inputs">
                {code.map((digit, index) => (
                <input
                    key={index}
                    id={`input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="code-input"
                />
                ))}
            </div>
            
            <button className="send-button" onClick={handleSendEmail}>
                Send Code to My Email
            </button>
            <button className="verify-button" onClick={handleVerify}>
                Verify
            </button>
            <button className="resend-button" onClick={handleSendEmail}>
                Resend Code
            </button>
      </div>
    );
  };
  
  export default EmailVerification;