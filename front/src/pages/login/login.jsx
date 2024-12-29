import React, { useState } from 'react';
import validation_signup from './signup-validation';
import axios from "axios";
import { validation_login, validate_only_email } from './login-validation';
import { useNavigate, useLocation  } from "react-router-dom";
import googleLogo from "../../assets/google.png";

const AuthPage = ({state}) => {
  
  const location = useLocation();
  const state_button = location.state;
  const [activeTab, setActiveTab] = useState(state_button);

  /*
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
  */

  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const [error_2, setError_2] = useState({});

  // signup values
  const [valuesSignUp, setValuesSignUp] = useState({
    firstname:'',
    lastname:'',
    email:'',
    password:''
  });

  // login values
  const [valuesLogin, setValuesLogin] = useState({
    email:'',
    password:''
  });

  // handel Login values
  const handelchangeValue_login = (event) => {
    setValuesLogin(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  // handel SignUp values
  const handelchangeValue_signup = (event) => {
    setValuesSignUp(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  // handel login submit
  const handleLogin = (e) => {
    e.preventDefault();
    const err = validation_login(valuesLogin);
        setError(err);
        
        axios.defaults.withCredentials = true;
        if (err.email === "" && err.password === "") {
            axios.post('http://localhost:3307/login', valuesLogin)
                .then(res => {
                    if (res.data === "Invalid email or password") {
                        alert(res.data); 
                    } else {
                        alert(res.data);
                        navigate('/');
                        window.location.reload();
                    }
                })
                .catch(err => console.error(err));
        }
    console.log('Login attempted:', valuesLogin.email);
  };

  // handel signup submit
  const handleSignup = (e) => {
    e.preventDefault();
    if (valuesSignUp.password !== confirmPassword) {
      alert("Passwords not match");
      return;
    }
    else{ 
        const err = validation_signup(valuesSignUp);
        setError_2(err);
        if(err.firstname === "" && err.lastname === "" && err.email === "" && err.password === "" ){
            axios.post('http://localhost:3307/create-account', valuesSignUp).then(res => {
                if (res.data === "Email already exists"){
                    alert(res.data);
                    navigate('/login', {state: 'login'});
                    location.reload(true);
                }
                else if (res.data === "User registered successfully!"){
                    alert("One more step: verify your email account");
                    axios.post('http://localhost:3307/verify-email-account', valuesSignUp)
                    .then(res => {
                        if(res.data === "Verification sent to " + valuesSignUp.email){
                            alert(res.data, "->"+ valuesSignUp.email);
                            navigate('/Aemailverify', { state: {email: valuesSignUp.email} });
                        }
                        else{
                            alert(res.data);
                        }
                    }).catch(err => {console.log(err)});
                }
                else{
                    alert(res.data);
                }
            }).catch(err => console.log(err));  
        }
    }
    console.log('Signup attempted:', valuesSignUp.email);
  };

  // same for login and sign up
  function loginWithGoogle() {
    window.location.href = 'http://localhost:3307/auth/google';
  }

  // handle forgot password
  const handelForgotPassword = (event) => {
    event.preventDefault();
    navigate('/passCode');
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-12  ">
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Image Section */}
      <div className="hidden md:block relative h-full min-h-[600px] rounded-2xl overflow-hidden">
        <img 
          src="https://img.freepik.com/free-photo/close-up-girl-girl-learning-online_23-2149014046.jpg?t=st=1735320323~exp=1735323923~hmac=6b420734a82ef8af0a3bed23198c0cdeb8bd7623edd75355a6e0c72ed66e9878&w=740" 
          alt="Learning" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/70 backdrop-blur-sm">
          <div className="flex flex-col justify-center h-full p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Welcome to CS Minds</h2>
            <p className="text-lg text-white/90">Join our community of learners and unlock your potential in computer science</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">CS Minds</h1>
          <p className="text-gray-600 mt-2">Elevate Your Learning Journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          {['login', 'signup'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 py-4 text-lg font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="space-y-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} method='POST' className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input 
                    id="login-email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    name="email"
                    onChange={handelchangeValue_login}
                    placeholder="Enter your email"
                  />
                  {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input 
                    id="login-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    name="password"
                    onChange={handelchangeValue_login}
                    placeholder="Enter your password"
                  />
                  {error.password && <span className="text-red-500 text-sm">{error.password}</span>}
                </div>
              </div>

              <div className="flex justify-start">
                <button 
                  type="button"
                  onClick={handelForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] shadow-lg"
              >
                Login
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-4 px-6 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transform hover:scale-[1.02] shadow-lg"
              >
                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google logo" className="w-6 h-6" />
                <span>Continue with Google</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-firstname" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="signup-firstname"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    name="firstname"
                    onChange={handelchangeValue_signup}
                    placeholder="First Name"
                  />
                  {error_2.firstname && <span className="text-red-500 text-sm">{error_2.firstname}</span>}
                </div>
                <div>
                  <label htmlFor="signup-lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="signup-lastname"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    name="lastname"
                    onChange={handelchangeValue_signup}
                    placeholder="Last Name"
                  />
                  {error_2.lastname && <span className="text-red-500 text-sm">{error_2.lastname}</span>}
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  name="email"
                  onChange={handelchangeValue_signup}
                  placeholder="Enter your email"
                />
                {error_2.email && <span className="text-red-500 text-sm">{error_2.email}</span>}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  name="password"
                  onChange={handelchangeValue_signup}
                  placeholder="Create a password"
                />
                {error_2.password && <span className="text-red-500 text-sm">{error_2.password}</span>}
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] shadow-lg"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full py-4 px-6 border border-gray-300 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transform hover:scale-[1.02] shadow-lg"
              >
                <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google logo" className="w-6 h-6" />
                <span>Sign up with Google</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default AuthPage;