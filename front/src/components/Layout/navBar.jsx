import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import img from '../../assets/5.svg'
const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Web Development",
    "Mobile Development",
    "Programming Languages",
    "Game Development",
    "IT & Software",
    "Office Productivity"
  ];

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    navigate(`/courses?category=${encodeURIComponent(category)}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 border-b bg-gray-50 z-50">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src={img}
                alt="CS Minds Logo"
                className="w-[70px] h-[55px] object-contain mr-2"
              />
              <span className="font-bold text-2xl text-blue-500">CS Minds</span>
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-600"></div>
          </button>

          <div className={`lg:flex flex-1 items-center justify-between ml-8 ${isOpen ? 'absolute top-20 left-0 right-0 bg-white p-4 border-b shadow-lg' : 'hidden'} lg:relative lg:top-0 lg:bg-transparent lg:border-none lg:shadow-none`}>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 hover:text-gray-600"
              >
                <span>Categories</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryClick(category)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 max-w-2xl mx-4 my-4 lg:my-0">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search anything..."
                  className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              <a href="#" className="hover:text-gray-600">
                <ShoppingCart className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-600">AI Minds</a>
             
              <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
              <Link to="/login">
                <button className="px-6 py-2 rounded-full border border-gray-800 hover:bg-gray-100">
                  Login
                </button>
                </Link>

                <Link to="/login">
                <button className="px-6 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700">
                  Sign Up
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;