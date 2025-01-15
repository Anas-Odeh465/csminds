import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Pencil, AlertCircle } from 'lucide-react';
import Settings_Validation from './settings_validation';
import axios from 'axios';

const AccountSettings = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [auth, setAuth] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setCurrentEmail(res1.data.Email);
        } else {
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setCurrentEmail(res2.data.user.email);
          } else {
            setAuth(false);
          }
        }
      } catch (err) {
        console.error("Error fetching auth status:", err);
        setAuth(false);
      }
    };
    fetchAuthStatus();
  }, [auth]);

  const handleLogout = () => {
    axios.get('http://localhost:3307/logout')
      .then(() => {
        navigate('/login', {state: 'signup'});
        location.reload(true);
      })
      .catch(err => console.log('Error during logout:', err));
  };
  
  const handleDeleteAccount = () => {
    axios.get(`http://localhost:3307/api/DELETE/user?e1=${currentEmail}`)
    .then(response => {
      if(response.data.message === 'User deleted successfully'){
        setShowDeleteAlert(false);
        handleLogout();
      }
      else{
        alert(response.data.error);
      }
    })
    
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword || !currentPassword) {
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

    axios.post(`http://localhost:3307/account-reset-password`, {
        email: currentEmail,
        currentPassword: currentPassword,
        newPassword: newPassword
    })
    .then(response => {
      if(response.data.message === 'Password updated successfully'){
        alert('Password updated successfully');
      }
      else{
        alert(response.data.error);
      }
    }).catch(err => {console.log(err)});
};

  

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-2">Account</h1>
      <p className="text-gray-600 mb-8">Edit your account settings and change your password here.</p>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Email:</h2>
        <input
            type="email"
            className="w-full bg-gray-100 p-3 border border-gray-600 rounded-lg cursor-not-allowed"
            value={currentEmail}
            disabled
            onChange={(e) => setCurrentEmail(e.target.value)}
          />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Password:</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Enter current password"
            className="w-full p-3 border border-gray-600 rounded-lg"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {error.password && <span className="text-red-500 text-sm mt-5 mb-5">{error.password}</span>}
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 border border-gray-600 rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {error.password && <span className="text-red-500 text-sm mt-5 mb-5">{error.password}</span>}
          <input
            type="password"
            placeholder="Re-type new password"
            className="w-full p-3 border border-gray-600 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error.password && <span className="text-red-500 text-sm mt-5 mb-5">{error.password}</span>}
          <button 
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Change password
          </button>
        </form>
      </div>

      <div className="border-t pt-8">
        <button
          onClick={() => setShowDeleteAlert(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>

      {showDeleteAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;