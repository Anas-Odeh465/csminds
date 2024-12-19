import React, { useState } from "react";
import "./forogtpass.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AccountEmailVerification = () => {
  const [code, setCode] = useState(["", "", "", ""]);

  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email; 

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

  const handleSendEmail = () => {
    if (email !== "") {
        axios.post('http://localhost:3307/verify-email-account', email)
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
      axios.post('http://localhost:3307/checkCode2', [enteredCode, email])
      .then(res => {
        if (res.data === "Email verified") {
            alert(res.data); 
            navigate('/login',{state: 'login'});
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
                <h2 className="text-lg font-semibold text-white mt-2">Verify your email</h2>
            </div>
        <div className="verification-inputs">
            {code.map((digit, index) => (
                <input
                    name="inputscode"
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

        <button className="verify-button" onClick={handleVerify}>
            Verify
        </button>
        
        <button className="resend-button" onClick={handleSendEmail}>
            Resend Code
        </button>
    </div>
  );
};

export default AccountEmailVerification;
