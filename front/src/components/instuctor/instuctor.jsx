import React, { useState, useEffect } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const JoinInstructorSection = () => {
  const [auth, setAuth] = useState(false);
  const [instructor, setInstructor] = useState('false');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
          setEmail(res1.data.Email);
        } else { 
          const res2 = await axios.get('http://localhost:3307/api/users/to');
          if (res2.data && res2.data.user) {
            setEmail(res2.data.user.email);
            setAuth(true);
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

  // check if Instructors are available
  useEffect(() => {
    const fetchInstructor = async () => {
      try{
        const res = await axios.get('http://localhost:3307/check=instructors',{params: { email }});
        if(res.data.instructors === 'true'){
          setInstructor('true');
          console.log('instructor: ', res.data.instructors);
        }else{
          setInstructor('false');
          console.log('No instructor found');
        }
      }catch(err){
        console.error("Error fetching instructor:", err);
      }
    }
    fetchInstructor();
  }, [instructor]);


  const instructorBenefits = [
    'Flexible Schedule',
    'Global Reach',
    'Competitive Compensation',
    'Professional Growth',
    'Cutting-edge Platform'
  ];

  return (
    <div className="bg-white py-16 w-full">
      <h2 className="text-4xl font-bold text-gray-800 mb-4 px-4 text-center">
        Join Us as an Instructor
      </h2>
      <p className="text-lg text-gray-700 mb-8 px-4 text-center max-w-2xl mx-auto">
        Share your expertise, inspire learners, and be part of a dynamic educational community that empowers professionals worldwide.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {instructorBenefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-blue-600">
              {benefit}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center">
        {auth ? (
          instructor === 'true' ? ( 
            <Link to="/become-instructor" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                Instructor Dashboard 
            </Link>
          ) : (
            <Link to="/become-instructor" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                Become an Instructor
            </Link>
          )
        ) : (
          <Link onClick={navigate('/login', {state: 'login'})}className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
              Login and join us as Instructor
          </Link>
        )}
      </div>
    </div>
  );
};

export default JoinInstructorSection;