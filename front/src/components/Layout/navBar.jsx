import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import img from '../../assets/5.svg';
import { UserAvatar, UserAvatarSmall, UserAvatar_medium }  from '../Profile/userAvat';
import CartPreview from '../CartPreview/CartPreview';
import { useCart } from '../../context/CourseContext/cartContext';


const NavigationBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [drop, setDrop] = useState(false);
  const [photo, setPhoto] = useState('');
  const [instructor, setInstructor] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Web Development",
    "Mobile Development",
    "Programming Languages",
    "Game Development",
    "IT & Software",
    "Data science",
    "Artificial intelligence",
  ];

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    navigate(`/courses?category=${encodeURIComponent(category)}`);
  };

  axios.defaults.withCredentials = true;

  // when the user logged in 
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setFirstname(res1.data.FirstName);
          setLastname(res1.data.LastName);
          setEmail(res1.data.Email);
          setPhoto(res1.data.photo);
          const res = await axios.get('http://localhost:3307/check=instructors',{params: { email }});
          if(res.data.instructors === 'found instructor'){
            setInstructor(true);
            console.log('instructor: ', res.data.instructors);
          }else{
            setInstructor('false');
            console.log('No instructor found');
          }
        } else {
          
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setAuth(true);
            setFirstname(res2.data.user.given_name);
            setLastname(res2.data.user.family_name);
            setEmail(res2.data.user.email);
            setInstructor(res2.data.instructor);
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
  }, [auth, instructor]);


  // on logout
  const handleLogout = () => {
    axios.get('http://localhost:3307/logout')
      .then(() => {
        navigate('/login', {state: 'login'});
        location.reload(true);
      })
      .catch(err => console.log('Error during logout:', err));
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); 
          navigate(`/courses?search=${encodeURIComponent(query)}`);
      }
  };

  // user options after login
  const options_1 = [
    "My learning",
    "My cart",
    "Instructor dashboard"
  ];

  const options_2 = [
    "Account settings",
    "Payment methods",
  ];

  const userProfileOption = [
    firstname + " "+  lastname
  ];

  const options_3 = [
    "Public profile",
    "Edit profile"
  ];

  const options_4 = [
    "Logout"
  ];

  // handel user profile option with operation...
  const handleProfileClicked = (option) => {
    if (option === firstname + " "+  lastname) {
      setDrop(false); 
      navigate('/publicProfile');
    } else if (option === "Logout"){
      handleLogout();
      setDrop(false); 
    }else if (option === "Public profile" || option === "My learning"){
      setDrop(false); 
      navigate(`/publicProfile`);
    }
    else if (option === "Edit profile"){
      setDrop(false); 
      navigate('/editProfile');
    }
    else if (option === "My cart"){
      setDrop(false); 
      navigate('/cart');
    }
    else if (option === "Instructor dashboard"){
      setDrop(false); 
      navigate('/instructorDashboard');
    }
    else if (option === "Payment methods"){
      setDrop(false); 
      navigate(`/checkoutPage`);
    }
    else if (option === "Account settings"){
      setDrop(false); 
      navigate(`/accountSettings`);
    }
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
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress} 
                  className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              {auth ? (<CartPreview />) : (<ShoppingCart className='w-5 h-5 text-gray-600 cursor-pointer' onClick={() => navigate('/login', {state: 'login'})}/>)}
              <a href="http://localhost/AI_Chat_Page/AIminds_Chat.php" className="text-gray-600">AI Mind</a>

              {auth && instructor ? 
              (
                <Link to='/instructorDashboard' className="text-gray-600 cursor-pointer">
                  Instructor
                </Link>
              ) : (auth && !instructor? 
                (
                  <a href="http://localhost:5173/become-instructor" className="text-gray-600">Teach with CS Minds</a>
                ) : (
                  <a className="text-gray-600 cursor-pointer" onClick={() => navigate('/login', {state: 'login'})}>Teach with CS Minds</a>
                )
              )}
            

              {auth ? (
                <div className="relative">
                  <button
                    onClick={() => setDrop(!drop)} 
                    className="flex items-center space-x-1 hover:text-gray-600"
                  >
                     {photo == 'No photo available' ? (<UserAvatar firstName={firstname} />) : 
                    ( <img src={`http://localhost:3307${photo}`} alt="Profile preview" 
                      style={{ width: '30px', display: 'block',
                      height: '30px', borderRadius: '50%', objectFit: 'cover' }} />) }
                     
                      
                    <span style={{paddingLeft: '10px'}}>{firstname} {lastname}</span>
                  </button>
                  {drop && (
                     
                    <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border">
                      {userProfileOption.map((option, index) => (
                      <button key={index}
                       onClick={() => handleProfileClicked(option)}
                       className="w-full text-left px-4 py-2 hover:bg-gray-50">

                        <div className="flex items-center">
                        {photo == 'No photo available' ? (<UserAvatar_medium firstName={firstname} />) : 
                        ( <img src={`http://localhost:3307${photo}`} alt="Profile preview" 
                          style={{ width: '50px', display: 'block',
                          height: '50px', borderRadius: '50%', objectFit: 'cover'}} />)}
                          <p className="ml-1 pl-[5px]">{option}</p>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 ml-[8px]">{email}</p>
                     </button>
                     ))} 
                      <hr />
                      {options_1.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleProfileClicked(option)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          {option}
                          
                        </button>
                        
                      ))} <hr />
                      {options_2.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleProfileClicked(option)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          {option}
                          
                        </button>
                        
                      ))}
                      <hr />
                      {options_3.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleProfileClicked(option)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          {option}
                          
                        </button>
                        
                      ))}<hr />
                      {options_4.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleProfileClicked(option)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                        >
                          {option}
                          
                        </button>
                        
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                  <button
                    onClick={() => navigate('/login', {state: 'login'})}
                    className="px-6 py-2 rounded-full border border-blue-900 hover:bg-gray-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/login', {state: 'signup'})}
                    className="px-6 py-2 rounded-full bg-blue-800 text-white hover:bg-gray-700"
                    id="Sign-Up"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;