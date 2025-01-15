import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StudentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [courseAssignments, setCourseAssignments] = useState(null);
   const [isSubmitted, setIsSubmitted] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('idc');
  const assignment_id = queryParams.get('aiud');
  const [answer, setAnswer] = useState('');
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState('');

  
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
            setAuth(true);
            setEmail(res2.data.Email);
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

  const handleSubmit = () => {
    setIsSubmitted(true);
    axios.post('http://localhost:3307/api/assignmentsSubmit', {email: email, assignment_id: assignment_id})
    .then((response) => {
      if (response.data.error === 'Failed to InsertAttemptQuery attempts') {
        alert('Failed to insert attempt. Please try again.');
      }
      else{
        navigate(`/showcoursevideo?idc=${courseId}`);
      }
    })
  };

  useEffect(() => {
    // assignmentPage  data
    axios.get(`http://localhost:3307/post/assignmentPage?AIDp=${assignment_id}`)
      .then(response => {
        setCourseAssignments(response.data);
        console.log('setCourseAssignments data: ', response.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [assignment_id]);

  if(!courseAssignments){
    return <div>Loading...</div>;
  }
  else{
    const filteredAssignments = Array.isArray(courseAssignments) ? courseAssignments : [];
    return (
      <div className="min-h-screen mt-36 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit your assignment</h2>
        {filteredAssignments?.map((assignment, index) => (
          <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {assignment.title}
            </h3>
            
            <div className="mb-4 text-gray-600">
              {assignment.description}
            </div>
            
            <div className="mb-4">
              <span className="font-medium text-gray-800">Question: </span>
              <span className="text-gray-700">
                {assignment.question}
              </span>
            </div>
          </div>
  
          <div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your Answer"
              rows="6"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            ></textarea>
          </div>
  
          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Answer
          </button>
        </div>
        ))}
        
      </div>
    );
  }
};

export default StudentPage;