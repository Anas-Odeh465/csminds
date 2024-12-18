import React, { useState } from 'react';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic
    console.log('Login attempted:', loginEmail);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Implement signup logic
    console.log('Signup attempted:', signupEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-12 mt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-8 py-6 text-center">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
              CS Minds
            </h1>
            <p className="text-white/80 mt-2 text-sm tracking-wide">
              Elevate Your Learning Journey
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-1/2 py-4 text-lg font-semibold transition-all duration-300 ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form Container */}
          <div className="p-8 space-y-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input 
                    id="login-email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input 
                    id="login-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Login
                </button>
                <div className="text-center">
                  <a href="#" className="text-sm text-blue-600 hover:underline transition-colors">
                    Forgot Password?
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input 
                    id="signup-email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input 
                    id="signup-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input 
                    id="confirm-password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Create Account
                </button>
                <div className="text-center text-sm text-gray-600">
                  By signing up, you agree to our 
                  <a href="#" className="ml-1 text-blue-600 hover:underline transition-colors">
                    Terms of Service
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Social Login Option */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span className="h-px w-16 bg-gray-300"></span>
            <span className="text-gray-500 font-medium">or continue with</span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-110">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
              </svg>
            </button>
            <button className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-110">
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.5v-9l7.5 4.5-7.5 4.5z"/>
              </svg>
            </button>
            <button className="p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-110">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;