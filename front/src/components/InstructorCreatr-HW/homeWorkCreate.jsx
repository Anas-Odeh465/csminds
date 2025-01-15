import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstructorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('idc');

  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    question: '',
    deadline: '',
    courseId: courseId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: value });
  };

  const handleSave = () => {
    if (!assignment.title ||!assignment.description ||!assignment.question || !assignment.deadline) {
      alert('Please fill out all fields');
      return;
    }
    else{
      axios.post('http://localhost:3307/api/create/assignments', assignment)
      .then(response => {
        if(response.data.message === 'Assignment created successfully'){
          navigate('/instructorDashboard')
        }
        else{
          alert(response.error);
        }
      }).catch(error => {console.log(error)});
     }
    }

  return (
    <div className="min-h-screen max-w-2xl mx-auto mt-36 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create an assignment</h2>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            value={assignment.title}
            onChange={handleChange}
            placeholder="Assignment Title"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <textarea
            name="description"
            value={assignment.description}
            onChange={handleChange}
            placeholder="Assignment Description"
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <textarea
            name="question"
            value={assignment.question}
            onChange={handleChange}
            placeholder="Assignment Question"
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <p className='text-gray-600 text-md font-bold mt-3 mb-3'>Set the deadline for your assignment</p>
          <input
            type="date"
            name="deadline"
            value={assignment.deadline}
            onChange={handleChange}
            placeholder="Submission Time (e.g., days)"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save and Post
        </button>
      </div>
    </div>
  );
};

export default InstructorPage;