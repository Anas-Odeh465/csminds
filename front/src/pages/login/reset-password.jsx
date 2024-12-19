import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const location = useLocation();
    const email = location.state?.email; 
  
    const handleSavePassword = () => {
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
  
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
  
      if (!email) {
        alert('Invalid process: Missing email.');
        return;
      }
  
      axios.post('http://localhost:3307/reset-password', { email, password: newPassword })
        .then(res => {
          if(res.data === 'Password updated successfully'){
            alert(res.data);
            navigate('/login', {state: 'login'});
          }
        })
        .catch(err => console.error(err));
    };
  
    return (
        <div className="reset-password-container">
        <div className="reset-password-header">
          <h1 className="text-2xl font-extrabold text-white drop-shadow-md">CS Minds</h1>
          <h2 className="text-lg font-semibold text-white mt-2">Reset Your Password</h2>
        </div>
      
        <p className="reset-password-description">
          Create a new password and confirm it to reset your account's password.
        </p>
      
        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="password-input"
          />
        </div>
      
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="password-input"
          />
        </div>
      
        {error && <p className="error-message">{error}</p>}
      
        <button onClick={handleSavePassword} className="save-password-button">
          Save Password
        </button>
      </div>
    );
  };
  
  export default ResetPassword;